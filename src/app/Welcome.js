import { getUser } from '@supabase/auth-helpers-nextjs';

export async function getServerSideProps(context) {
  const { user } = await getUser(context);

  if (!user) {
    return {
      redirect: {
        destination: '/auth',
        permanent: false,
      },
    };
  }

  return { props: { user } };
}

function ProtectedPage({ user }) {
  return <div>Welcome, {user.email}</div>;
}

export default ProtectedPage;
