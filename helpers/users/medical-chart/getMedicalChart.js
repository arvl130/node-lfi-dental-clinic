const { getFirestore } = require("firebase-admin/firestore")
const db = getFirestore()

module.exports = async (patientUid) => {
  const docSnap = await db
    .collection("users")
    .doc(patientUid)
    .collection("patientRecords")
    .doc("medicalChart")
    .get()

  if (docSnap.exists) return docSnap.data()
  else
    return {
      personalInformation: {
        fullName: "",
        gender: "",
        birthDate: "",
        maritalStatus: "",
        mobileNo: "",
        telephoneNo: "",
      },
      medicalHistory: {
        heartAilmentDisease: "",
        hospitalAdmission: "",
        selfMedication: "",
        allergies: "",
        operation: "",
        tumors: "",
        diabetes: false,
        sinusitis: false,
        bleedingGums: false,
        hypertension: false,
        stomachDisease: false,
        bloodDisease: false,
        headache: false,
        liverDisease: false,
        cold: false,
        kidneyDisease: false,
        pregnant: "",
        familyHistory: "",
      },
      dentalHistory: {
        bleedingInMouth: false,
        gumsChangeColor: false,
        sensitiveTeeth: false,
        badBreath: false,
        palate: false,
        teethChangeColor: false,
        lumpsInMouth: false,
        clickingSoundInMouth: false,
        pastDentalCare: "",
      },
    }
}
