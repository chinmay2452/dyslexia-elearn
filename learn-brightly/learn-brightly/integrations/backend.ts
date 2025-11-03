import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zhnfqxoivdfdruknqxcq.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpobmZxeG9pdmRmZHJ1a25xeGNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjIwNjk5MjIsImV4cCI6MjA3NzY0NTkyMn0.UyEWFYV3wv3omEIswUn7qx4fXaQr05KagFQb3ggAF5Q";
const supabase = createClient(supabaseUrl, supabaseKey);

// 🚀 Start session for child
export async function startSession({ childId, minutes }: { childId: string; minutes: number }) {
  const { data, error } = await supabase
    .from("sessions")
    .insert([{ child_id: childId, duration_minutes: minutes, active: true }])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return { message: "Session started successfully", session: data };
}

// 🛑 End active session
export async function endSession({ childId }: { childId: string }) {
  const { data, error } = await supabase
    .from("sessions")
    .update({ active: false, end_time: new Date().toISOString() })
    .eq("child_id", childId)
    .eq("active", true);

  if (error) throw new Error(error.message);
  return { message: "Session ended successfully", session: data };
}

// ✅ Get session status
export async function getSessionStatus(childId: string) {
  const { data, error } = await supabase
    .from("sessions")
    .select("*")
    .eq("child_id", childId)
    .eq("active", true)
    .maybeSingle();

  if (error) throw new Error(error.message);

  if (!data) return { active: false };
  return {
    active: true,
    startTime: new Date(data.start_time).getTime(),
    endTime: data.end_time ? new Date(data.end_time).getTime() : null,
  };
}

// 📊 Push progress updates (incremental)
export async function pushProgress(payload: {
  childId: string;
  starsDelta?: number;
  activitiesDelta?: number;
  emotion?: string;
  screenTimeMsDelta?: number;
}) {
  const { data: existing } = await supabase
    .from("progress")
    .select("*")
    .eq("child_id", payload.childId)
    .single();

  const updated = {
    stars_earned: (existing?.stars_earned ?? 0) + (payload.starsDelta ?? 0),
    activities_completed: (existing?.activities_completed ?? 0) + (payload.activitiesDelta ?? 0),
    last_activity: payload.emotion ?? existing?.last_activity ?? "N/A",
    weekly_progress: Math.min(100, (existing?.weekly_progress ?? 0) + 5),
    updated_at: new Date().toISOString(),
  };

  let result;
  if (existing)
    result = await supabase
      .from("progress")
      .update(updated)
      .eq("child_id", payload.childId)
      .select()
      .single();
  else
    result = await supabase
      .from("progress")
      .insert([{ child_id: payload.childId, ...updated }])
      .select()
      .single();

  if (result.error) throw new Error(result.error.message);
  return { message: "Progress updated", progress: result.data };
}

// 📥 Fetch current progress for child
export async function fetchProgress(childId: string) {
  const { data, error } = await supabase
    .from("progress")
    .select("*")
    .eq("child_id", childId)
    .single();

  if (error && error.code !== "PGRST116") throw new Error(error.message);

  return (
    data ?? {
      activities_completed: 0,
      stars_earned: 0,
      weekly_progress: 0,
      last_activity: "None",
    }
  );
}

// 👶 Add new child record
export async function addChild(child: { id: string; name: string; age: number; level: string }) {
  const { data, error } = await supabase
    .from("children")
    .insert([
      {
        unique_id: child.id,
        name: child.name,
        age: child.age,
        learning_level: child.level,
      },
    ])
    .select()
    .single();

  if (error) throw new Error(error.message);
  return { message: "Child added successfully", child: data };
}