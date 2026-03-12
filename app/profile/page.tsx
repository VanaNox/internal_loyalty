import { Header } from '@/components/header';
import { gems } from '@/lib/data';

export default function ProfilePage() {
  return (
    <>
      <Header active="/profile" />
      <main className="mx-auto w-full max-w-6xl space-y-6 px-4 py-8 md:px-6">
        <h1 className="text-3xl font-semibold">Профіль користувача</h1>
        <section className="glass p-6">
          <p className="text-lg">Олексій Коваль</p>
          <p className="text-sm text-slate-300">oleksii.koval@sfp.local</p>
        </section>
        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {gems.map((gem) => (
            <article key={gem.name} className={`glass bg-gradient-to-br ${gem.color} p-5`}>
              <p className="text-sm text-slate-300">{gem.name}</p>
              <p className="mt-2 text-3xl font-bold">{gem.value}</p>
            </article>
          ))}
        </section>
      </main>
    </>
  );
}
