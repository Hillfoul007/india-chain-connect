import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import DashboardLayout from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { Truck, Plus, Package, MapPin, ArrowRight } from "lucide-react";

export default function LogisticsPage() {
  const { user } = useAuth();
  const [shipments, setShipments] = useState<any[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ origin: "", destination: "", description: "", weight_kg: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) loadShipments();
  }, [user]);

  const loadShipments = async () => {
    const { data } = await supabase
      .from("shipments")
      .select("*")
      .eq("user_id", user!.id)
      .order("created_at", { ascending: false });
    setShipments(data ?? []);
  };

  const createShipment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setLoading(true);

    const trackingNumber = "IC-" + Date.now().toString(36).toUpperCase();
    const proofHash = "ipfs:" + crypto.randomUUID().replace(/-/g, "").slice(0, 32);

    const { error } = await supabase.from("shipments").insert({
      user_id: user.id,
      origin: form.origin,
      destination: form.destination,
      description: form.description,
      weight_kg: form.weight_kg ? parseFloat(form.weight_kg) : null,
      tracking_number: trackingNumber,
      proof_hash: proofHash,
      estimated_delivery: new Date(Date.now() + 3 * 86400000).toISOString(),
    });

    if (error) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Shipment created!", description: `Tracking: ${trackingNumber}` });
      setForm({ origin: "", destination: "", description: "", weight_kg: "" });
      setShowForm(false);
      loadShipments();
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    await supabase.from("shipments").update({
      status,
      ...(status === "delivered" ? { delivered_at: new Date().toISOString() } : {}),
    }).eq("id", id);
    loadShipments();
  };

  const statusColors: Record<string, string> = {
    created: "bg-muted text-muted-foreground",
    picked_up: "bg-accent/20 text-accent",
    in_transit: "bg-primary/20 text-primary",
    delivered: "bg-green-500/20 text-green-400",
    cancelled: "bg-destructive/20 text-destructive",
  };

  const nextStatus: Record<string, string> = {
    created: "picked_up",
    picked_up: "in_transit",
    in_transit: "delivered",
  };

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-display text-2xl font-bold">Logistics</h1>
        <Button onClick={() => setShowForm(!showForm)}>
          <Plus className="w-4 h-4 mr-2" /> New Shipment
        </Button>
      </div>

      {showForm && (
        <Card className="glass mb-6">
          <CardContent className="pt-6">
            <form onSubmit={createShipment} className="grid gap-4 sm:grid-cols-2">
              <Input placeholder="Origin (e.g. Mumbai)" value={form.origin} onChange={(e) => setForm({ ...form, origin: e.target.value })} required className="bg-secondary/50" />
              <Input placeholder="Destination (e.g. Delhi)" value={form.destination} onChange={(e) => setForm({ ...form, destination: e.target.value })} required className="bg-secondary/50" />
              <Input placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="bg-secondary/50" />
              <Input type="number" placeholder="Weight (kg)" value={form.weight_kg} onChange={(e) => setForm({ ...form, weight_kg: e.target.value })} className="bg-secondary/50" />
              <Button type="submit" disabled={loading} className="sm:col-span-2">
                {loading ? "Creating..." : "Create Shipment"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="space-y-4">
        {shipments.length === 0 ? (
          <Card className="glass">
            <CardContent className="py-12 text-center">
              <Truck className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">No shipments yet. Create your first one!</p>
            </CardContent>
          </Card>
        ) : (
          shipments.map((s) => (
            <Card key={s.id} className="glass">
              <CardContent className="py-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <code className="text-xs text-primary">{s.tracking_number}</code>
                      <span className={`text-xs px-2 py-0.5 rounded-full capitalize ${statusColors[s.status]}`}>
                        {s.status.replace("_", " ")}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-3 h-3 text-muted-foreground" />
                      <span>{s.origin}</span>
                      <ArrowRight className="w-3 h-3 text-muted-foreground" />
                      <span>{s.destination}</span>
                    </div>
                    {s.proof_hash && (
                      <p className="text-xs text-muted-foreground mt-1">IPFS: {s.proof_hash.slice(0, 20)}...</p>
                    )}
                  </div>
                  {nextStatus[s.status] && (
                    <Button size="sm" variant="outline" onClick={() => updateStatus(s.id, nextStatus[s.status])}>
                      Mark {nextStatus[s.status].replace("_", " ")}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </DashboardLayout>
  );
}
