import { auth } from '@repo/auth/server';
import { database } from '@repo/db';
import { redirect } from 'next/navigation';

const App = async () => {
  const { userId } = await auth();

  if (!userId) {
    redirect('/sign-in');
  }

  // Check if user has completed onboarding
  const userProfile = await database.user.findUnique({
    where: { id: userId },
    select: { onboardingCompleted: true }
  });

  // Redirect based on onboarding status
  if (!userProfile?.onboardingCompleted) {
    redirect('/onboarding');
  } else {
    redirect('/dashboard');
  }
};

export default App;
