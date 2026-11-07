const hour = 3600000;
const targets = {Niedrig:[24,120],Normal:[8,48],Hoch:[2,16],Kritisch:[0.5,4]};

export function serviceDeadlines(ticket, now = Date.now()) {
  const start = Date.parse(ticket.createdAt || ticket.history?.[0]?.at);
  if (!Number.isFinite(start)) return [];
  return targetsFor(ticket.priority).map((hours,index) => {
    const due = start + hours * hour;
    const completed = Date.parse(index ? ticket.resolvedAt : ticket.respondedAt);
    const status = ticket.status === "Abgeschlossen" && !Number.isFinite(completed) ? "Zeitpunkt nicht erfasst" :
      Number.isFinite(completed) ? (completed <= due ? "Erfüllt" : "Verspätet erfüllt") :
      due <= now ? "Überfällig" : due - now <= hour ? "Frist naht" : "Im Zeitrahmen";
    return {label:index ? "Lösungsfrist" : "Reaktionsfrist",due,status};
  });
}

function targetsFor(priority) {
  return Object.hasOwn(targets,priority) ? targets[priority] : targets.Normal;
}

export function deadlineRank(ticket, now = Date.now()) {
  if (ticket.status === "Abgeschlossen") return 2;
  const deadlines = serviceDeadlines(ticket,now);
  return deadlines.some(item => item.status === "Überfällig") ? 0 :
    deadlines.some(item => item.status === "Frist naht") ? 1 : 2;
}

export function matchingArticles(tickets, service, subject, area = "IT") {
  const words = subject.toLowerCase().match(/[\p{L}\p{N}]{3,}/gu) ?? [];
  return tickets.filter(ticket => (ticket.area || "IT") === area).map(ticket => ticket.article).filter(Boolean).map(article => ({
    article, score:(article.service === service ? 3 : 0) +
      words.filter(word => article.title.toLowerCase().includes(word)).length
  })).filter(entry => entry.score > 0).sort((a,b) => b.score-a.score).slice(0,3).map(entry => entry.article);
}

