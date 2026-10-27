import './index.css';

export default function App() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6 py-12 text-slate-900">
      <section className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-blue-700">
          Project scaffold
        </p>
        <h1 className="mt-3 text-3xl font-bold tracking-tight sm:text-4xl">
          BoardPrep 2027
        </h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          A starting point for a student-focused preparation resource. The
          application is being set up; product features will be added later.
        </p>
      </section>
    </main>
  );
}
