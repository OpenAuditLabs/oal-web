import RegistrationForm from "@/components/auth/RegistrationForm";

export default function RegistrationPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50">
      <div className="w-full max-w-md p-8 bg-white rounded shadow">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>
        <RegistrationForm />
      </div>
    </main>
  );
}
