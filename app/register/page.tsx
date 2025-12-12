// app/register/page.tsx
import RegisterForm from './RegisterForm';

export const metadata = { title: 'Register • Handcrafted Haven' };

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-gray flex flex-col justify-center items-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-black text-white mb-4">Handcrafted Haven</h1>
          <p className="text-silver text-xl">Join the Ohio State crafting community</p>
        </div>

        <RegisterForm />
      </div>
    </div>
  );
}