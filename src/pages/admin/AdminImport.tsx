import { useState } from "react";
import { supabase } from "../../lib/supabase";
import { supabaseAdmin } from "../../lib/supabaseAdmin";
import { Check, X, RefreshCw, Users, AlertTriangle } from "lucide-react";

const USUARIOS = [
  { email:"laurasomacont@gmail.com",            nome:"Laura Lopes De Matos",               empresa:"soma_prime", cargo:"collaborator", setor:"fiscal" },
  { email:"thayssomacont@gmail.com",            nome:"Thays Oliveira",                      empresa:"soma_prime", cargo:"collaborator", setor:"dp" },
  { email:"jessicapimentasomacont@gmail.com",   nome:"Jessica Pimenta",                     empresa:"soma_prime", cargo:"collaborator", setor:"cs" },
  { email:"milenasomacont@gmail.com",           nome:"Milena De Oliveira",                  empresa:"soma_prime", cargo:"collaborator", setor:"dp" },
  { email:"chayenysomacont@gmail.com",          nome:"Chayeny Dias Fernandes",              empresa:"soma_prime", cargo:"manager",      setor:"cs" },
  { email:"jaquelinecarneleaosoma@gmail.com",   nome:"Jaqueline Ferreira",                  empresa:"soma_prime", cargo:"collaborator", setor:"contabil" },
  { email:"larissasomacont@gmail.com",          nome:"Larissa Gomes Pimenta",               empresa:"soma_prime", cargo:"collaborator", setor:"societario" },
  { email:"sabrina2somacont@gmail.com",         nome:"Sabrina Alves Cordeiro",              empresa:"soma_prime", cargo:"collaborator", setor:"fiscal" },
  { email:"kellyjsomacont@gmail.com",           nome:"Kelly Janine Fernandes De Farias",    empresa:"soma_prime", cargo:"collaborator", setor:"fiscal" },
  { email:"vivianesomacont@gmail.com",          nome:"Viviane Dos Santos Maciel",           empresa:"soma_prime", cargo:"collaborator", setor:"cs" },
  { email:"matheussomacont@gmail.com",          nome:"Matheus Felipe Monteiro Dos Santos",  empresa:"soma_prime", cargo:"collaborator", setor:"cs" },
  { email:"beatrizjorgesomacont@gmail.com",     nome:"Beatriz Rodrigues Jorge",             empresa:"soma_prime", cargo:"collaborator", setor:"fiscal" },
  { email:"biancaramossomacont@gmail.com",      nome:"Bianca Ramos Soares Guedes",          empresa:"soma_prime", cargo:"collaborator", setor:"cs" },
  { email:"sabrina1somacont@gmail.com",         nome:"Sabrina Dos Santos Sousa",            empresa:"soma_prime", cargo:"collaborator", setor:"contabil" },
  { email:"anabelsomacont@gmail.com",           nome:"Anabel Santana Pego",                 empresa:"soma_prime", cargo:"collaborator", setor:"dp" },
  { email:"amandasomacont@gmail.com",           nome:"Amanda Karine Oliveira De Almeida",   empresa:"soma_prime", cargo:"collaborator", setor:"omie" },
  { email:"phconsultpro8@gmail.com",            nome:"João Pedro Sampaio",                  empresa:"ph_consult", cargo:"collaborator", setor:"omie" },
  { email:"tributario.soma@gmail.com",          nome:"Mayara Cecillia",                     empresa:"soma_prime", cargo:"collaborator", setor:"fiscal" },
  { email:"tedsomacont@gmail.com",              nome:"Ted Willian De Melo Lima",            empresa:"soma_prime", cargo:"collaborator", setor:"societario" },
  { email:"alcionesomacont@gmail.com",          nome:"Alcione Ferreira De Sousa",           empresa:"soma_prime", cargo:"collaborator", setor:"dp" },
  { email:"soniasomacont1@gmail.com",           nome:"Sonia Cristina Cordeiro De Oliveira", empresa:"soma_prime", cargo:"collaborator", setor:"fiscal" },
  { email:"indanarasomacont@gmail.com",         nome:"Indanara Gomes Das Neves",            empresa:"soma_prime", cargo:"collaborator", setor:"dp" },
  { email:"albert.figueiredo@hotmail.com",      nome:"Albert Figueiredo",                   empresa:"soma_prime", cargo:"manager",      setor:"cs" },
  { email:"carolsomacont@gmail.com",            nome:"Carol Sampaio",                       empresa:"soma_prime", cargo:"manager",      setor:"cs" },
  { email:"niveasomacont@gmail.com",            nome:"Nivea Mylenna Carneiro De Oliveira",  empresa:"soma_prime", cargo:"collaborator", setor:"fiscal" },
  { email:"fernandasomacont@gmail.com",         nome:"Fernanda Mendes De Sousa",            empresa:"soma_prime", cargo:"collaborator", setor:"dp" },
  { email:"vittorcontasoma@gmail.com",          nome:"Vittor Emmanuel Lopes De Almeida",    empresa:"soma_prime", cargo:"collaborator", setor:"fiscal" },
  { email:"mariapriscilasomacont@gmail.com",    nome:"Maria Priscila Alves Souza",          empresa:"soma_prime", cargo:"collaborator", setor:"fiscal" },
  { email:"isadoracontsoma@gmail.com",          nome:"Isadora Almeida",                     empresa:"soma_prime", cargo:"collaborator", setor:"societario" },
  { email:"luizasomacont@gmail.com",            nome:"Luiza Cristina Almeida",              empresa:"soma_prime", cargo:"collaborator", setor:"cs" },
  { email:"beatrizsomacont@gmail.com",          nome:"Beatriz (Biazinha)",                  empresa:"soma_prime", cargo:"collaborator", setor:"fiscal" },
  { email:"alinesomacont2024@gmail.com",        nome:"Aline Alves Paranhos",                empresa:"soma_prime", cargo:"collaborator", setor:"fiscal" },
  { email:"leonorfroescontadora@gmail.com",     nome:"Leonor Froes",                        empresa:"soma_prime", cargo:"manager",      setor:"cs" },
  { email:"emanuele@contasoma.com.br",          nome:"Emanuele De Lourdes Martins Alves",   empresa:"soma_prime", cargo:"collaborator", setor:"cs" },
  { email:"annasomacont@gmail.com",             nome:"Anna Karolyne Aparecida",             empresa:"soma_prime", cargo:"collaborator", setor:"contabil" },
  { email:"brunasomacont@gmail.com",            nome:"Bruna Dos Santos Macedo",             empresa:"soma_prime", cargo:"collaborator", setor:"cs" },
  { email:"alinemsomacont@gmail.com",           nome:"Aline Marques Lopes",                 empresa:"soma_prime", cargo:"collaborator", setor:"dp" },
  { email:"natalicesomacont@gmail.com",         nome:"Natalice Ferreira De Azevedo",        empresa:"soma_prime", cargo:"collaborator", setor:"fiscal" },
  { email:"danielasomacont@gmail.com",          nome:"Daniela Dos Santos Almeida Barbosa",  empresa:"soma_prime", cargo:"collaborator", setor:"fiscal" },
  { email:"phconsultpro@gmail.com",             nome:"Leandro Fonseca",                     empresa:"soma_prime", cargo:"manager",      setor:"cs" },
  { email:"isabellasomacont@gmail.com",         nome:"Isabella",                            empresa:"soma_prime", cargo:"collaborator", setor:"fiscal" },
  { email:"eduardosomacont@gmail.com",          nome:"Eduardo Cordeiro Da Cruz",            empresa:"soma_prime", cargo:"collaborator", setor:"fiscal" },
  { email:"kesiasomacont@gmail.com",            nome:"Kesia Maria Moreira",                 empresa:"soma_prime", cargo:"collaborator", setor:"cs" },
  { email:"phconsultpro11@gmail.com",           nome:"Mayara Rodrigues",                    empresa:"ph_consult", cargo:"collaborator", setor:"omie" },
  { email:"brenda@contasoma.com.br",            nome:"Brenda Nascimento",                   empresa:"soma_prime", cargo:"collaborator", setor:"societario" },
  { email:"yonesomacont@gmail.com",             nome:"Yone Sabrina Sousa Santos",           empresa:"soma_prime", cargo:"collaborator", setor:"fiscal" },
  { email:"phconsultpro10@gmail.com",           nome:"Rarisson Carvalho",                   empresa:"ph_consult", cargo:"collaborator", setor:"omie" },
];

type Status = "pending" | "ok" | "skip" | "error";
interface Result { email: string; nome: string; status: Status; msg?: string; }

export default function AdminImport() {
  const [results, setResults]   = useState<Result[]>([]);
  const [running, setRunning]   = useState(false);
  const [done, setDone]         = useState(false);

  async function runImport() {
    setRunning(true); setDone(false);
    const out: Result[] = [];

    for (const u of USUARIOS) {
      // Tenta criar no auth
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        email: u.email,
        password: "123456",
        email_confirm: true,
        user_metadata: { full_name: u.nome },
      });

      if (error?.message?.includes("already")) {
        // Usuário já existe — apenas atualiza profile
        const existingId = (await supabaseAdmin.auth.admin.listUsers()).data.users.find((x: any) => x.email === u.email)?.id;
        if (existingId) {
          await supabase.from("profiles").upsert({
            id: existingId, full_name: u.nome, email: u.email,
            company: u.empresa, role: u.cargo, sector: u.setor,
          }, { onConflict: "id" });
        }
        out.push({ email: u.email, nome: u.nome, status: "skip", msg: "Já existia — profile atualizado" });
        setResults([...out]);
        continue;
      }

      if (error || !data.user) {
        out.push({ email: u.email, nome: u.nome, status: "error", msg: error?.message ?? "Erro desconhecido" });
        setResults([...out]);
        continue;
      }

      // Cria profile
      await supabase.from("profiles").upsert({
        id: data.user.id, full_name: u.nome, email: u.email,
        company: u.empresa, role: u.cargo, sector: u.setor,
      }, { onConflict: "id" });

      out.push({ email: u.email, nome: u.nome, status: "ok" });
      setResults([...out]);
    }

    setRunning(false); setDone(true);
  }

  const total  = results.length;
  const criados = results.filter(r => r.status === "ok").length;
  const skipped = results.filter(r => r.status === "skip").length;
  const erros   = results.filter(r => r.status === "error").length;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-xl font-bold" style={{ color:"var(--soma-text)" }}>📥 Importação em Massa</h1>
        <p className="text-sm mt-1" style={{ color:"var(--soma-muted)" }}>
          Cria {USUARIOS.length} colaboradores com senha padrão <strong>123456</strong>.
          Usuários já existentes terão apenas o profile atualizado.
        </p>
      </div>

      {!running && !done && (
        <div className="rounded-2xl border p-6 space-y-4" style={{ backgroundColor:"var(--soma-card)", borderColor:"var(--soma-border)" }}>
          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ backgroundColor:"rgba(245,166,35,0.08)", border:"1px solid rgba(245,166,35,0.2)" }}>
            <AlertTriangle size={16} style={{ color:"#f5a623" }} />
            <p className="text-xs" style={{ color:"#f5a623" }}>
              Esta operação cria {USUARIOS.length} usuários de uma vez. Pode levar ~1 minuto. Não feche a página.
            </p>
          </div>
          <button onClick={runImport}
            className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-sm hover:opacity-90"
            style={{ backgroundColor:"#f5a623", color:"#000" }}>
            <Users size={16} /> Importar {USUARIOS.length} colaboradores
          </button>
        </div>
      )}

      {running && (
        <div className="flex items-center gap-3 p-4 rounded-xl" style={{ backgroundColor:"var(--soma-card)", border:"1px solid var(--soma-border)" }}>
          <RefreshCw size={16} className="animate-spin" style={{ color:"#f5a623" }} />
          <p className="text-sm" style={{ color:"var(--soma-text)" }}>
            Importando... {total}/{USUARIOS.length}
          </p>
        </div>
      )}

      {done && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label:"Criados", value:criados, color:"#22c55e", bg:"rgba(34,197,94,0.1)" },
            { label:"Já existiam", value:skipped, color:"#f5a623", bg:"rgba(245,166,35,0.1)" },
            { label:"Erros", value:erros, color:"#f87171", bg:"rgba(248,113,113,0.1)" },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className="rounded-xl p-4 text-center" style={{ backgroundColor: bg }}>
              <p className="text-2xl font-bold" style={{ color }}>{value}</p>
              <p className="text-xs mt-1" style={{ color }}>{label}</p>
            </div>
          ))}
        </div>
      )}

      {results.length > 0 && (
        <div className="rounded-2xl border overflow-hidden" style={{ borderColor:"var(--soma-border)" }}>
          <div className="max-h-96 overflow-y-auto">
            {results.map((r, i) => (
              <div key={i} className="flex items-center gap-3 px-4 py-2.5 border-b last:border-0"
                style={{ borderColor:"var(--soma-border)", backgroundColor:"var(--soma-card)" }}>
                <span className="shrink-0">
                  {r.status === "ok"    && <Check size={14} style={{ color:"#22c55e" }} />}
                  {r.status === "skip"  && <span style={{ color:"#f5a623", fontSize:12 }}>~</span>}
                  {r.status === "error" && <X size={14} style={{ color:"#f87171" }} />}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate" style={{ color:"var(--soma-text)" }}>{r.nome}</p>
                  <p className="text-xs truncate" style={{ color:"var(--soma-muted)" }}>{r.email}</p>
                </div>
                {r.msg && <p className="text-xs shrink-0" style={{ color:"var(--soma-muted)" }}>{r.msg}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}