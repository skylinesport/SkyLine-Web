import { LegalLayout, Section, List } from '@/components/LegalLayout';

export default function DeleteAccount() {
  return (
    <LegalLayout title="Delete Your Account" updated="September 22, 2026">
      <p>
        You can permanently delete your Skylinesports account and all associated data at any time.
        This page explains how, and exactly what is removed.
      </p>

      <Section title="1. Delete in the app (fastest)">
        <List
          items={[
            <>Open the <strong>Skylinesports</strong> app and sign in.</>,
            <>Go to your <strong>Profile</strong>, then tap the <strong>Settings</strong> (gear) icon.</>,
            <>Scroll to the bottom and tap <strong>Delete account</strong>.</>,
            <>Confirm. Your account and data are removed immediately.</>,
          ]}
        />
      </Section>

      <Section title="2. Request deletion by email">
        <p>
          If you no longer have the app installed, email us from the address on your account and we
          will delete it for you:{' '}
          <a href="mailto:support@skylinesport.in?subject=Delete%20my%20account" className="text-primary underline">
            support@skylinesport.in
          </a>
          . Please include the email address (or username) on your account so we can verify and
          locate it. We will confirm once it is done.
        </p>
      </Section>

      <Section title="3. What gets deleted">
        <p>Deleting your account permanently removes:</p>
        <List
          items={[
            <>Your profile — username, photos, bio, in-game IDs and stats.</>,
            <>Your tournament registrations and match history.</>,
            <>Your friends, team-up invites and chat messages.</>,
            <>Your reward claims, referrals and points.</>,
            <>Your login credentials and notification tokens.</>,
          ]}
        />
        <p>This action is permanent and cannot be undone. Once deleted, the data cannot be recovered.</p>
      </Section>

      <Section title="4. Data retention">
        <p>
          Account data is deleted immediately on request. We do not keep a copy afterward, except
          where a limited record must be retained to comply with a legal or financial obligation
          (for example, transaction records where applicable), which is then removed once that
          obligation ends.
        </p>
      </Section>

      <Section title="5. Timeframe">
        <p>In-app deletions take effect right away. Email requests are processed within 7 days.</p>
      </Section>
    </LegalLayout>
  );
}
