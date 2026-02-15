import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Shield, CheckCircle, Clock, AlertTriangle, Fingerprint, Copy } from "lucide-react";
import { motion } from "framer-motion";

export default function WalletPage() {
  const { user } = useAuth();
  const [wallet, setWallet] = useState<any>(null);
  const [verifying, setVerifying] = useState(false);
  const [kycHistory, setKycHistory] = useState<any[]>([]);

  useEffect(() => {
    if (!user) return;
    loadData();
  }, [user]);

  const loadData = async () => {
    const [w, k] = await Promise.all([
      supabase.from("wallets").select("*").eq("user_id", user!.id).maybeSingle(),
      supabase.from("kyc_verifications").select("*").eq("user_id", user!.id).order("created_at", { ascending: false }),
    ]);
    setWallet(w.data);
    setKycHistory(k.data ?? []);
  };

  const startKYC = async () => {
    if (!user) return;
    setVerifying(true);

    // Insert KYC verification record
    await supabase.from("kyc_verifications").insert({
      user_id: user.id,
      verification_type: "zk-kyc",
      status: "processing",
    });

    // Update wallet status
    await supabase.from("wallets").update({ kyc_status: "in_progress" }).eq("user_id", user.id);

    // Simulate ZK-proof generation (mock)
    setTimeout(async () => {
      const proofHash = "zk:" + crypto.randomUUID().replace(/-/g, "").slice(0, 32);

      await supabase
        .from("kyc_verifications")
        .update({ status: "verified", proof_hash: proofHash, verified_at: new Date().toISOString() })
        .eq("user_id", user.id)
        .eq("status", "processing");

      await supabase
        .from("wallets")
        .update({ kyc_status: "verified", kyc_verified_at: new Date().toISOString() })
        .eq("user_id", user.id);

      setVerifying(false);
      toast({ title: "ZK-KYC Verified!", description: "Your identity has been verified using zero-knowledge proofs." });
      loadData();
    }, 3000);
  };

  const copyDID = () => {
    if (wallet?.did_address) {
      navigator.clipboard.writeText(wallet.did_address);
      toast({ title: "Copied!", description: "DID address copied to clipboard." });
    }
  };

  const statusIcon = {
    pending: <Clock className="w-5 h-5 text-muted-foreground" />,
    in_progress: <AlertTriangle className="w-5 h-5 text-primary animate-pulse" />,
    verified: <CheckCircle className="w-5 h-5 text-green-400" />,
    rejected: <AlertTriangle className="w-5 h-5 text-destructive" />,
  };

  return (
    <DashboardLayout>
      <h1 className="font-display text-2xl font-bold mb-6">DID Wallet</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Wallet Card */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Fingerprint className="w-5 h-5 text-primary" /> Your Digital Identity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-xs text-muted-foreground mb-1">DID Address</p>
              <div className="flex items-center gap-2 bg-secondary/50 rounded-lg p-3">
                <code className="text-xs text-foreground flex-1 break-all">{wallet?.did_address}</code>
                <Button variant="ghost" size="icon" onClick={copyDID}>
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div>
              <p className="text-xs text-muted-foreground mb-1">Wallet Balance</p>
              <p className="text-3xl font-display font-bold">₹{wallet?.wallet_balance ?? 0}</p>
            </div>
          </CardContent>
        </Card>

        {/* KYC Card */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-accent" /> ZK-KYC Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              {statusIcon[wallet?.kyc_status as keyof typeof statusIcon]}
              <div>
                <p className="font-medium capitalize">{wallet?.kyc_status?.replace("_", " ")}</p>
                <p className="text-xs text-muted-foreground">
                  {wallet?.kyc_status === "verified"
                    ? "Identity verified via zero-knowledge proof"
                    : "Verify without exposing personal data"}
                </p>
              </div>
            </div>

            {wallet?.kyc_status !== "verified" && (
              <Button onClick={startKYC} disabled={verifying} className="w-full">
                {verifying ? (
                  <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full" />
                ) : (
                  <>
                    <Fingerprint className="w-4 h-4 mr-2" />
                    Start ZK-KYC Verification
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* KYC History */}
      {kycHistory.length > 0 && (
        <Card className="glass mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Verification History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {kycHistory.map((k) => (
                <div key={k.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                  <div>
                    <p className="text-sm font-medium capitalize">{k.status}</p>
                    <p className="text-xs text-muted-foreground">{new Date(k.created_at).toLocaleDateString()}</p>
                  </div>
                  {k.proof_hash && (
                    <code className="text-xs text-muted-foreground">{k.proof_hash.slice(0, 16)}...</code>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
}
