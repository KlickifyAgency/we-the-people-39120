import { createClient } from '@supabase/supabase-js';
import { sendCitizenActivityEmail } from './email';

const ALDERMEN: Record<number,string> = {
  1:'Valencia Hall', 2:'Billie Joe Frazier', 3:'Sarah Carter-Smith',
  4:'Felicia Bridgewater-Irving', 5:'Benjamin Davis', 6:'Curtis Moroney'
};

function getSupabase() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
}

async function getAllUsers(): Promise<{ id: string; email: string; full_name: string; ward_number: number | null }[]> {
  const supabase = getSupabase();
  const { data: { users } } = await supabase.auth.admin.listUsers();
  const { data: profiles } = await supabase.from('profiles').select('id, full_name, ward_number, email');
  const profileMap = new Map((profiles ?? []).map((p: any) => [p.id, p]));
  console.log(`[notify-citizens] getAllUsers: ${(users ?? []).length} auth users found`);
  return (users ?? [])
    .filter(u => u.email)
    .map(u => ({
      id: u.id,
      email: u.email!,
      full_name: profileMap.get(u.id)?.full_name ?? 'Neighbor',
      ward_number: profileMap.get(u.id)?.ward_number ?? null,
    }));
}

export async function notifyAllCitizens({
  eventType, category, wardNumber, reportId, description, photoUrl, excludeUserId,
}: {
  eventType: 'new_report' | 'alderman_response';
  category: string;
  wardNumber: number | string;
  reportId: string;
  description?: string;
  photoUrl?: string;
  excludeUserId?: string;
}) {
  const users = await getAllUsers();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://we-the-people-39120.vercel.app';
  const reportUrl = `${appUrl}/report/${reportId}`;
  const aldermanName = ALDERMEN[Number(wardNumber)] ?? 'Your Alderman';

  const subjects: Record<string, string> = {
    new_report: `🚨 New Report in Ward ${wardNumber} — We The People 39120`,
    alderman_response: `✅ ${aldermanName} Has Officially Responded — We The People 39120`,
  };

  const filteredUsers = users.filter(u => u.id !== excludeUserId);
  console.log(`[notify-citizens] Sending to ${filteredUsers.length} users`);
  const promises = filteredUsers
    .map(u =>
      sendCitizenActivityEmail({
        to: u.email,
        subject: subjects[eventType],
        citizenName: u.full_name,
        eventType,
        category,
        wardNumber,
        aldermanName,
        description,
        reportUrl,
        photoUrl,
      }).catch(e => console.error(`Failed to notify ${u.email}:`, e))
    );

  const results = await Promise.allSettled(promises);
  const failed = results.filter(r => r.status === 'rejected').length;
  const succeeded = results.filter(r => r.status === 'fulfilled').length;
  console.log(`[notify-citizens] Sent: ${succeeded}, Failed: ${failed}, Total: ${results.length}`);
}

export async function notifyReportOwner({
  reportId, eventType, category, wardNumber, description,
}: {
  reportId: string;
  eventType: 'me_too' | 'status_change';
  category: string;
  wardNumber: number | string;
  description?: string;
}) {
  const supabase = getSupabase();
  const { data: report } = await supabase.from('reports').select('user_id').eq('id', reportId).single();
  if (!report?.user_id) return;

  const { data: authUser } = await supabase.auth.admin.getUserById(report.user_id);
  const { data: profile } = await supabase.from('profiles').select('full_name').eq('id', report.user_id).single();
  if (!authUser?.user?.email) return;

  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://we-the-people-39120.vercel.app';
  const aldermanName = ALDERMEN[Number(wardNumber)] ?? 'Your Alderman';

  const subjects: Record<string, string> = {
    me_too: `👍 A Neighbor Supports Your Report — We The People 39120`,
    status_change: `📋 Your Report Status Has Changed — We The People 39120`,
  };

  await sendCitizenActivityEmail({
    to: authUser.user.email,
    subject: subjects[eventType],
    citizenName: profile?.full_name ?? 'Neighbor',
    eventType,
    category,
    wardNumber,
    aldermanName,
    description,
    reportUrl: `${appUrl}/report/${reportId}`,
  }).catch(e => console.error('Failed to notify report owner:', e));
}
