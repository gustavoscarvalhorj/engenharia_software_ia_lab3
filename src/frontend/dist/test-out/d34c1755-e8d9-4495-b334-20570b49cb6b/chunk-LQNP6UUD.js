// src/app/shared/validators/search-criteria.validators.ts
function parseLocalDate(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }
  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(year, month - 1, day);
  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day ? date : null;
}
function todayLocalIso(now = /* @__PURE__ */ new Date()) {
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}
function notPastDate(today = todayLocalIso()) {
  return (control) => {
    const date = parseLocalDate(control.value);
    return date && control.value >= today ? null : { notPastDate: true };
  };
}
var validStayPeriod = (control) => {
  const checkIn = parseLocalDate(control.get("checkIn")?.value);
  const checkOut = parseLocalDate(control.get("checkOut")?.value);
  return checkIn && checkOut && checkOut > checkIn ? null : { invalidStayPeriod: true };
};
function nightsBetween(checkIn, checkOut) {
  const start = parseLocalDate(checkIn);
  const end = parseLocalDate(checkOut);
  if (!start || !end || end <= start) {
    return 0;
  }
  return Math.round((end.getTime() - start.getTime()) / 864e5);
}

export {
  notPastDate,
  validStayPeriod,
  nightsBetween
};
//# sourceMappingURL=chunk-LQNP6UUD.js.map
