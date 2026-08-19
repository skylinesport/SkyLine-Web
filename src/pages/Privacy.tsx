import { LegalLayout, Section, List } from '@/components/LegalLayout';

export default function Privacy() {
  return (
    <LegalLayout title="Privacy Policy" updated="August 19, 2026">
      <p>
        This Privacy Policy explains what information Skylinesports (&ldquo;we&rdquo;,
        &ldquo;us&rdquo;) collects, how we use it, and the choices you have. It applies to the
        Skylinesports mobile app and website (the &ldquo;Service&rdquo;). By using the Service, you
        agree to the practices described here.
      </p>

      <Section title="1. Information we collect">
        <List
          items={[
            <><strong>Account information</strong> — your email address (or Google account) and a password you set. If you sign in with Google, we receive your basic Google profile to create your account.</>,
            <><strong>Profile information</strong> — your username, and anything you choose to add such as a bio, avatar and in-game IDs (for example your BGMI or Free Fire ID).</>,
            <><strong>Activity</strong> — the tournaments you register for, your results and badges, and your friends and team-up invites.</>,
            <><strong>Device tokens</strong> — if you enable notifications, we store a push token so we can send you match reminders, room credentials and results.</>,
            <><strong>Basic technical data</strong> — information needed to operate and secure the Service, such as your app version and general request logs.</>,
          ]}
        />
      </Section>

      <Section title="2. How we use your information">
        <List
          items={[
            'Create and manage your account and profile.',
            'Run tournaments — register you, deliver room credentials, and publish results and rewards.',
            'Power social features such as player search, friend requests, team-up invites and chat.',
            'Send you notifications you have enabled (reminders, results and updates).',
            'Keep the community safe, prevent cheating and abuse, and enforce our Terms.',
            'Respond to your support requests.',
          ]}
        />
      </Section>

      <Section title="3. Notifications">
        <p>
          We send push notifications only if you allow them. You can turn categories (reminders,
          results and general updates) on or off at any time from <em>Settings</em> in the app, or by
          disabling notifications for Skylinesports in your device settings.
        </p>
      </Section>

      <Section title="4. How we share information">
        <p>We do not sell your personal information. We share it only:</p>
        <List
          items={[
            <><strong>With other players, by design</strong> — your username, avatar, bio, in-game IDs, stats and badges are visible to players who view your profile or search for you. Do not add anything to your profile you would not want other players to see.</>,
            <><strong>With service providers</strong> — trusted companies that help us run the Service, such as our hosting provider, our transactional email provider, and Google for sign-in. They may process data only on our behalf.</>,
            <><strong>For legal reasons</strong> — if required by law, or to protect the rights, safety and security of our users and the Service.</>,
          ]}
        />
      </Section>

      <Section title="5. Data retention and deletion">
        <p>
          We keep your information for as long as your account is active. You can delete your account
          at any time from <em>Edit Profile &rarr; Delete Account</em> in the app. Deleting your
          account permanently removes your profile, tournament history, friends, notifications and
          related data from our systems. Some records may be retained briefly where required by law
          or for security.
        </p>
      </Section>

      <Section title="6. Your choices and rights">
        <List
          items={[
            'Access and update your profile information directly in the app.',
            'Control which notifications you receive from Settings.',
            'Delete your account and its data at any time.',
            <>Contact us at <a href="mailto:support@skylinesport.in" className="text-primary hover:underline">support@skylinesport.in</a> with any privacy request or question.</>,
          ]}
        />
      </Section>

      <Section title="7. Children">
        <p>
          Skylinesports is not directed to children under 13, and we do not knowingly collect
          personal information from them. If you believe a child has provided us information, contact
          us and we will remove it.
        </p>
      </Section>

      <Section title="8. Security">
        <p>
          We use reasonable technical and organisational measures to protect your information,
          including encrypted connections and hashed passwords. No method of transmission or storage
          is completely secure, but we work to keep your data safe.
        </p>
      </Section>

      <Section title="9. Third-party games and services">
        <p>
          Games such as BGMI and Free Fire are operated by their own publishers under their own
          privacy policies; we are not affiliated with them. Signing in with Google is subject to
          Google&rsquo;s privacy policy. This policy covers only Skylinesports.
        </p>
      </Section>

      <Section title="10. Changes to this policy">
        <p>
          We may update this Privacy Policy from time to time. We will revise the &ldquo;Last
          updated&rdquo; date above and, for significant changes, notify you in the app.
        </p>
      </Section>

      <Section title="11. Contact us">
        <p>
          For any questions about this policy or your data, email us at{' '}
          <a href="mailto:support@skylinesport.in" className="text-primary hover:underline">
            support@skylinesport.in
          </a>
          .
        </p>
      </Section>
    </LegalLayout>
  );
}
