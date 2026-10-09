// key = translation key. live = Firestore se real-time list (hospitals / specialities / doctors)
export const NAV = [
  { key: "forPatients", items: [["bookAppt", "/book"], ["myAppts", "/appointments"], ["reports", "/reports"], ["feedback", "/feedback"]] },
  { key: "ourHospitals", live: "hospitals" },
  { key: "findDoctor", live: "doctors" },
  { key: "specialities", live: "specialities" },
  { key: "departments", items: [["dEmergency", "/departments?name=emergency"], ["dRadiology", "/departments?name=radiology"], ["dLab", "/departments?name=laboratory"], ["dPharmacy", "/departments?name=pharmacy"]] },
  { key: "healthCheckup", items: [["basicCheck", "/health-checkup?package=basic"], ["seniorPkg", "/health-checkup?package=senior"], ["cardiacPkg", "/health-checkup?package=cardiac"], ["diabetesPkg", "/health-checkup?package=diabetes"]] },
  { key: "international", to: "/international" },
  { key: "corporate", to: "/corporate" },
  { key: "blog", to: "/blog" },
];