import { LegalLayout, Section, List } from '@/components/LegalLayout';

export default function Terms() {
  return (
    <LegalLayout title="Terms of Service" updated="August 19, 2026">
      <p>
        Welcome to Skylinesports. These Terms of Service (&ldquo;Terms&rdquo;) govern your use of
        the Skylinesports mobile app and website (together, the &ldquo;Service&rdquo;), operated by
        Skylinesports (&ldquo;we&rdquo;, &ldquo;us&rdquo;). By creating an account or using the
        Service, you agree to these Terms. If you do not agree, please do not use the Service.
      </p>

      <Section title="1. Who can use Skylinesports">
        <p>
          You must be at least 13 years old to use the Service. If you are under the age of majority
          where you live, you may only use Skylinesports with the involvement of a parent or
          guardian. You are responsible for making sure your use complies with the rules of any game
          publisher and with local law.
        </p>
      </Section>

      <Section title="2. Your account">
        <List
          items={[
            'You register with an email address and password, or by signing in with Google. Keep your credentials secure — you are responsible for activity under your account.',
            'You choose a unique username and may add a bio, avatar and in-game IDs. Other players can find you by your username and send friend or team-up requests.',
            'One account per person. Do not impersonate others or create accounts to evade a suspension.',
            'Tell us at support@skylinesport.in if you believe your account has been accessed without permission.',
          ]}
        />
      </Section>

      <Section title="3. Tournaments">
        <p>
          Skylinesports hosts free-to-enter esports tournaments (such as BGMI and Free Fire, with
          more added over time). Tournaments are created and managed by us. By registering you agree
          to:
        </p>
        <List
          items={[
            'Play fairly and follow the rules, format and schedule published for each tournament.',
            'Join the correct room using the credentials we deliver before the match, and be available at the listed start time.',
            'Accept that results, standings, badges and any rewards are determined by us in good faith, and that we may correct or reverse them if we find an error or rule violation.',
          ]}
        />
        <p>
          Tournaments are free in the current version. We do not charge entry fees, and any prizes or
          rewards are provided at our discretion as described for each tournament.
        </p>
      </Section>

      <Section title="4. Community conduct">
        <p>
          Skylinesports includes social features — profiles, friends, team-up invites and chat. To
          keep the community safe, you agree not to:
        </p>
        <List
          items={[
            'Harass, threaten, bully or discriminate against other players.',
            'Cheat, use unauthorised software, exploit bugs, or otherwise gain an unfair advantage in tournaments.',
            'Post content that is illegal, hateful, sexually explicit, or infringes someone else’s rights.',
            'Spam, scam, phish, or share another person’s private information.',
            'Attempt to disrupt, reverse-engineer, or gain unauthorised access to the Service.',
          ]}
        />
        <p>
          We may remove content and suspend or terminate accounts that break these rules, with or
          without notice.
        </p>
      </Section>

      <Section title="5. Subscriptions and payments">
        <p>
          The current version of Skylinesports is free. If we introduce a paid subscription in the
          future, the price, billing cycle and cancellation terms will be shown clearly before you
          are charged, and your continued use of any paid feature will be subject to those terms.
        </p>
      </Section>

      <Section title="6. Third-party games and services">
        <p>
          Skylinesports is an independent platform. Games such as BGMI and Free Fire are the property
          of their respective publishers, and we are not affiliated with, endorsed by, or sponsored
          by them. Your use of any game remains subject to that publisher&rsquo;s own terms. We also
          rely on third-party providers (for example, for hosting, email and Google sign-in) to
          operate the Service.
        </p>
      </Section>

      <Section title="7. Intellectual property">
        <p>
          The Skylinesports name, logo, app and website design are owned by us. You may not copy,
          modify or distribute them without our permission. You keep ownership of the content you
          add (such as your bio and avatar), and grant us a licence to display it within the Service
          so the app can function.
        </p>
      </Section>

      <Section title="8. Ending your use">
        <p>
          You can delete your account at any time from <em>Edit Profile &rarr; Delete Account</em> in
          the app. Deleting your account permanently removes your profile, tournament history,
          friends and related data. We may suspend or terminate your access if you breach these Terms
          or to protect the Service and its users.
        </p>
      </Section>

      <Section title="9. Disclaimers and liability">
        <p>
          The Service is provided &ldquo;as is&rdquo; without warranties of any kind. We do not
          guarantee that the Service will always be available, uninterrupted or error-free. To the
          fullest extent permitted by law, Skylinesports is not liable for any indirect or
          consequential loss arising from your use of the Service.
        </p>
      </Section>

      <Section title="10. Changes to these Terms">
        <p>
          We may update these Terms from time to time. When we do, we will revise the &ldquo;Last
          updated&rdquo; date above. Significant changes will be communicated in the app. Continuing
          to use the Service after changes take effect means you accept the updated Terms.
        </p>
      </Section>

      <Section title="11. Governing law">
        <p>
          These Terms are governed by the laws of India, and any disputes will be subject to the
          courts having jurisdiction there.
        </p>
      </Section>

      <Section title="12. Contact us">
        <p>
          Questions about these Terms? Reach us at{' '}
          <a href="mailto:support@skylinesport.in" className="text-primary hover:underline">
            support@skylinesport.in
          </a>
          .
        </p>
      </Section>
    </LegalLayout>
  );
}
