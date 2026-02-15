import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wallet, Truck, BarChart3, Shield } from "lucide-react";

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState({ kycStatus: "pending", shipments: 0, creditScore: 0, balance: 0 });

  useEffect(() => {
    if (!user) return;
    const load = async () => {
      const [walletRes, shipmentsRes, creditRes] = await Promise.all([
        supabase.from("wallets").select("kyc_status, wallet_balance").eq("user_id", user.id).maybeSingle(),
        supabase.from("shipments").select("id", { count: "exact", head: true }).eq("user_id", user.id),
        supabase.from("credit_scores").select("score").eq("user_id", user.id).order("calculated_at", { ascending: false }).limit(1).maybeSingle(),
      ]);
      setStats({
        kycStatus: walletRes.data?.kyc_status ?? "pending",
        balance: walletRes.data?.wallet_balance ?? 0,
        shipments: shipmentsRes.count ?? 0,
        creditScore: creditRes.data?.score ?? 0,
      });
    };
    load();
  }, [user]);

  const cards = [
    { title: "KYC Status", value: stats.kycStatus.replace("_", " "), icon: Shield, color: stats.kycStatus === "verified" ? "text-green-400" : "text-primary" },
    { title: "Wallet Balance", value: `₹${stats.balance}`, icon: Wallet, color: "text-primary" },
    { title: "Shipments", value: stats.shipments.toString(), icon: Truck, color: "text-accent" },
    { title: "Credit Score", value: stats.creditScore ? `${stats.creditScore}/1000` : "Not scored", icon: BarChart3, color: "text-saffron-glow" },
  ];

  return (
    <DashboardLayout>
      <h1 className="font-display text-2xl font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => (
          <Card key={c.title} className="glass">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">{c.title}</CardTitle>
              <c.icon className={`w-5 h-5 ${c.color}`} />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-display font-bold capitalize">{c.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </DashboardLayout>
  );
}
