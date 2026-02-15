import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { BarChart3, Zap, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

export default function CreditScorePage() {
  const { user } = useAuth();
  const [scores, setScores] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [latestAnalysis, setLatestAnalysis] = useState<string | null>(null);

  useEffect(() => {
    if (user) loadScores();
  }, [user]);

  const loadScores = async () => {
    const { data } = await supabase
      .from("credit_scores")
      .select("*")
      .eq("user_id", user!.id)
      .order("calculated_at", { ascending: false })
      .limit(10);
    setScores(data ?? []);
    if (data?.[0]?.ai_analysis) setLatestAnalysis(data[0].ai_analysis);
  };

  const calculateScore = async () => {
    if (!user) return;
    setLoading(true);

    try {
      // Gather activity data
      const [shipmentsRes, walletRes, kycRes] = await Promise.all([
        supabase.from("shipments").select("*").eq("user_id", user.id),
        supabase.from("wallets").select("*").eq("user_id", user.id).maybeSingle(),
        supabase.from("kyc_verifications").select("*").eq("user_id", user.id).eq("status", "verified"),
      ]);

      const activityData = {
        totalShipments: shipmentsRes.data?.length ?? 0,
        deliveredShipments: shipmentsRes.data?.filter((s) => s.status === "delivered").length ?? 0,
        kycVerified: walletRes.data?.kyc_status === "verified",
        verificationCount: kycRes.data?.length ?? 0,
        walletBalance: walletRes.data?.wallet_balance ?? 0,
      };

      // Call AI edge function for credit scoring
      const { data, error } = await supabase.functions.invoke("ai-credit-score", {
        body: { activityData },
      });

      if (error) throw error;

      const score = data.score;
      const factors = data.factors;
      const analysis = data.analysis;

      await supabase.from("credit_scores").insert({
        user_id: user.id,
        score,
        factors,
        ai_analysis: analysis,
      });

      toast({ title: "Credit Score Calculated!", description: `Your score: ${score}/1000` });
      loadScores();
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const latestScore = scores[0]?.score;
  const scoreColor = latestScore >= 700 ? "text-green-400" : latestScore >= 400 ? "text-primary" : "text-destructive";

  return (
    <DashboardLayout>
      <h1 className="font-display text-2xl font-bold mb-6">AI Credit Score</h1>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Score Display */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5 text-primary" /> Activity-Based Score
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            {latestScore ? (
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                <p className={`text-6xl font-display font-bold ${scoreColor}`}>{latestScore}</p>
                <p className="text-muted-foreground text-sm">/1000</p>
              </motion.div>
            ) : (
              <div>
                <p className="text-4xl font-display font-bold text-muted-foreground">--</p>
                <p className="text-muted-foreground text-sm mt-2">No score calculated yet</p>
              </div>
            )}
            <Button onClick={calculateScore} disabled={loading} className="w-full">
              <Zap className="w-4 h-4 mr-2" />
              {loading ? "Analyzing with AI..." : "Calculate Score with AI"}
            </Button>
          </CardContent>
        </Card>

        {/* AI Analysis */}
        <Card className="glass">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-accent" /> AI Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            {latestAnalysis ? (
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{latestAnalysis}</p>
            ) : (
              <p className="text-sm text-muted-foreground">Calculate your score to get an AI-powered analysis of your credit factors.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Score History */}
      {scores.length > 1 && (
        <Card className="glass mt-6">
          <CardHeader>
            <CardTitle className="text-lg">Score History</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {scores.map((s) => (
                <div key={s.id} className="flex items-center justify-between p-3 bg-secondary/30 rounded-lg">
                  <span className="text-sm">{new Date(s.calculated_at).toLocaleDateString()}</span>
                  <span className="font-display font-bold text-primary">{s.score}/1000</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </DashboardLayout>
  );
}
