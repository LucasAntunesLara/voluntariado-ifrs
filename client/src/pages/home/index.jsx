import {
  ArrowDown,
  ArrowRight,
  CalendarDays,
  HeartHandshake,
  MapPin,
  Sparkles,
  UsersRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import Header from "@/components/layout/header";

const steps = [
  {
    icon: UsersRound,
    number: "01",
    title: "Crie sua conta",
    description:
      "Faça seu cadastro como voluntário e conte para a gente um pouco sobre você.",
  },
  {
    icon: CalendarDays,
    number: "02",
    title: "Encontre uma ação",
    description:
      "Explore os eventos e escolha uma oportunidade que combine com você.",
  },
  {
    icon: HeartHandshake,
    number: "03",
    title: "Faça parte",
    description:
      "Solicite sua participação e venha construir algo bom com a comunidade.",
  },
];

const Home = () => (
  <div className="min-h-screen overflow-hidden bg-[#fbfaf6] font-sans text-emerald-900">
    <Header />

    <main className="mx-auto w-[min(1180px,calc(100%-64px))] max-[850px]:w-[min(100%-40px,660px)] max-[850px]:max-w-165 max-[620px]:w-[calc(100%-36px)]">
      <section
        className="relative grid min-h-157.5 grid-cols-[1.02fr_0.98fr] items-center gap-[clamp(40px,7vw,100px)] py-18 pb-20 max-[850px]:min-h-[137.5 max-[850px]:grid-cols-[1fr_0.86fr] max-[850px]:gap-6.5 max-[850px]:py-15.5 max-[620px]:grid-cols-1 max-[620px]:gap-9.5 max-[620px]:pb-14 max-[620px]:pt-14.5"
        aria-labelledby="hero-title"
      >
        <div className="relative z-1">
          <p className="mb-5. flex items-center gap-2.5 text-[0.76rem] font-bold uppercase leading-normal tracking-wide text-emerald-600">
            <span
              className="h-2 w-2 shrink-0 rounded-full bg-rose-300 shadow-[0_0_0_4px_#FFE2E2]"
              aria-hidden="true"
            />
            Voluntariado IFRS · Campus Bento Gonçalves
          </p>
          <h1
            id="hero-title"
            className="m-0 max-w-155 text-[clamp(3rem,5.4vw,5.1rem)] font-bold leading-[1.03] tracking-[-0.075em] text-emerald-900 max-[850px]:text-[clamp(2.7rem,7vw,4rem)] max-[620px]:text-[clamp(2.8rem,12vw,4rem)]"
          >
            Seu tempo pode
            <br />
            <span className="text-emerald-600">formar</span> realidades.
          </h1>
          <p className="mt-6.25 max-w-122.5 text-[1.04rem] leading-[1.8] text-[#63736a] max-[620px]:text-[0.97rem]">
            Conectamos pessoas dispostas a fazer o bem a iniciativas que
            fortalecem nossa comunidade. Tem espaço para você nessa mudança.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              className="inline-flex min-h-13 items-center justify-center gap-2.75 rounded-full border border-transparent bg-emerald-600 px-5.75 text-[0.92rem] font-[650] text-white no-underline transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#105a35] focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-[#81b891] motion-reduce:transition-none"
              to="/cadastro"
            >
              Quero ser voluntário
              <ArrowRight size={18} aria-hidden="true" />
            </Link>
            <Link
              className="inline-flex min-h-13 items-center justify-center gap-2.75 rounded-full border border-[#d9e0d9] bg-transparent px-5.75 text-[0.92rem] font-[650] text-rose-600 no-underline transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:border-[#a8c3ae] hover:bg-[#f1f5ef] focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-[#81b891] motion-reduce:transition-none"
              to="/eventos"
            >
              Conhecer as ações
            </Link>
          </div>
          <a
            className="m-9 inline-flex items-center gap-2 text-[0.82rem] font-[550] text-[#63736a] no-underline hover:text-emerald-600 focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-[#81b891]"
            href="#como-funciona"
          >
            Descubra como participar
            <ArrowDown size={16} aria-hidden="true" />
          </a>
        </div>

        {/* Visual */}
        <div className="relative mr-3 h-111.25 max-[850px]:mr-0 max-[850px]:h-90 max-[620px]:mx-auto max-[620px]:h-[min(86vw,390px)] max-[620px]:w-[calc(100%-12px)]">
          <div
            className="absolute -right-5 -top-5 z-0 h-3/4 w-[65%] rotate-[8deg] rounded-[48%_52%_48%_52%] border border-[#dbe8d9]"
            aria-hidden="true"
          />
          <img
            className="relative h-full w-full rounded-[48%_48%_24px_24px] object-cover shadow-[0_24px_64px_#243d2c20]"
            src="public\imgs\hero-section-img.jpg"
            alt="Voluntários reunidos em uma ação comunitária"
          />
          <div className="absolute -right-9 bottom-8.5 flex max-w-77.5 items-center gap-3.25 rounded-2xl border border-[#edf0e8] bg-white px-4.5 py-3.75 shadow-[0_14px_40px_#243d2c1a] max-[850px]:-right-2.5 max-[850px]:bottom-5 max-[850px]:max-w-68.75 max-[850px]:p-3 max-[620px]:-right-1.75 max-[620px]:bottom-4 max-[620px]:max-w-[min(310px,calc(100%-20px))]">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-rose-100 text-rose-600">
              <HeartHandshake size={22} aria-hidden="true" />
            </span>
            <span>
              <strong className="block text-[0.83rem] text-emerald-900">
                Juntos, fazemos acontecer.
              </strong>
              <small className="mt-[0.75 block text-[0.7rem] leading-[1.45] text-[#63736a]">
                Uma comunidade mais acolhedora começa com você.
              </small>
            </span>
          </div>
          <div className="absolute left-5 top-5 flex items-center gap-1.5 rounded-full border border-[#ffffff80] bg-[#ffffffed] px-3 py-2 text-[0.72rem] font-semibold text-emerald-800">
            <MapPin size={15} aria-hidden="true" className="text-rose-600" />
            Bento Gonçalves, RS
          </div>
        </div>

        <div
          className="absolute bottom-11.5 right-[48%] grid h-13 w-13 place-items-center rounded-full border border-[#e1e9dc] bg-[#fffefa] text-[#89a979] max-[850px]:hidden"
          aria-hidden="true"
        >
          <Sparkles size={28} />
        </div>
      </section>

      <section
        className="border-t border-[#e8e9e1] py-20.75 pb-24 max-[620px]:py-16"
        id="como-funciona"
        aria-labelledby="how-title"
      >
        <div className="mx-auto max-w-145 text-center">
          <p className="mb-3 flex items-center justify-center gap-2.5 text-[0.76rem] font-bold uppercase leading-normal tracking-wide text-rose-600">
            É mais simples do que parece
          </p>
          <h2
            id="how-title"
            className="m-0 text-[clamp(2rem,4vw,3rem)] font-[680] leading-[1.15] tracking-[-0.055em] text-emerald-900"
          >
            Um gesto de cada vez.
          </h2>
          <p className="mt-3.5 text-[0.98rem] leading-[1.75] text-[#63736a]">
            Comece hoje. A gente ajuda você a encontrar onde sua vontade de
            contribuir pode florescer.
          </p>
        </div>

        <div className="mt-12 grid grid-cols-3 gap-5 max-[850px]:gap-3 max-[620px]:mt-8.5 max-[620px]:grid-cols-1">
          {steps.map(({ icon: Icon, number, title, description }) => (
            <article
              className="min-h-53.75 rounded-lg border border-[#e8e9e1] bg-[#fffefa] p-6.25 max-[850px]:p-5 max-[620px]:min-h-0"
              key={number}
            >
              <div className="flex items-center justify-between">
                <span className="grid h-12 w-12 place-items-center rounded-[14px] bg-rose-100 text-rose-600">
                  <Icon size={23} aria-hidden="true" />
                </span>
                <span className="text-[0.8rem] font-bold tracking-[0.08em] text-[#a4b2a3]">
                  {number}
                </span>
              </div>
              <h3 className="mb-2 mt-5.75 text-[1.1rem] font-[650] text-emerald-900">
                {title}
              </h3>
              <p className="m-0 text-[0.88rem] leading-[1.7] text-[#63736a]">
                {description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section
        className="mb-13.5 flex items-center justify-between gap-8 rounded-5. bg-linear-to-r from-emerald-600 to-emerald-700 px-[clamp(24px,5vw,60px)] py-10.75 text-white bg-[radial-gradient(ellipse_at_85%_10%,#ffffff1f, transparent_34%)] max-[620px]:mb-9.5 max-[620px]:flex-col max-[620px]:items-start max-[620px]:gap-5.75 max-[620px]:px-6 max-[620px]:py-7.5 rounded-2xl"
        aria-labelledby="callout-title"
      >
        <div>
          <p className="mb-2.5 flex items-center gap-2.5 text-[0.76rem] font-bold uppercase leading-normal tracking-wide text-emerald-100">
            A comunidade precisa de você
          </p>
          <h2
            id="callout-title"
            className="m-0 text-[clamp(1.8rem,3.5vw,2.55rem)] font-[680] leading-[1.15] tracking-[-0.055em] text-white"
          >
            O próximo passo pode ser seu.
          </h2>
          <p className="mt-2.75 max-w-145 text-[0.93rem] leading-[1.7] text-[#e2eee3]">
            Cadastre-se gratuitamente e descubra como fazer parte de ações que
            aproximam pessoas.
          </p>
        </div>
        <Link
          className="inline-flex min-h-13 shrink-0 items-center justify-center gap-2.75 rounded-full border border-transparent bg-white px-5.75 text-[0.92rem] font-[650] text-[#105a35] no-underline transition-transform duration-200 ease-out hover:-translate-y-0.5 hover:bg-[#f1f5ef] focus-visible:outline-[3px] focus-visible:outline-offset-4 focus-visible:outline-[#81b891] motion-reduce:transition-none"
          to="/cadastro"
        >
          Fazer meu cadastro
          <ArrowRight size={18} aria-hidden="true" />
        </Link>
      </section>
    </main>

    {/* FOOTER */}
    <footer className="mx-auto flex w-[min(1180px,calc(100%-64px))] justify-between gap-5 border-t border-[#e8e9e1] pb-7 pt-5.5 text-[0.76rem] text-[#63736a] max-[850px]:w-[min(100%-40px,660px)] max-[850px]:max-w-165 max-[620px]:w-[calc(100%-36px)] max-[620px]:flex-col max-[620px]:gap-1.5">
      <span>Voluntariado IFRS · Campus Bento Gonçalves</span>
      <span>Conectando pessoas, fortalecendo comunidades.</span>
    </footer>
  </div>
);

export default Home;
