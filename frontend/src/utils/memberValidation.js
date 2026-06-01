const phonePattern = /^[0-9+\-\s()]{7,15}$/;
const bloodGroupPattern = /^(A|B|AB|O)[+-]$/i;

export const validateMemberForm = (formData) => {
  const errors = {};
  const age = Number(formData.age);

  if (!formData.name.trim()) {
    errors.name = "Name is required";
  } else if (formData.name.trim().length < 2) {
    errors.name = "Name must be at least 2 characters";
  }

  if (!formData.address.trim()) {
    errors.address = "Address is required";
  } else if (formData.address.trim().length < 5) {
    errors.address = "Address must be at least 5 characters";
  }

  if (!formData.phone.trim()) {
    errors.phone = "Phone is required";
  } else if (!phonePattern.test(formData.phone.trim())) {
    errors.phone = "Enter a valid phone number";
  }

  if (formData.age === "") {
    errors.age = "Age is required";
  } else if (!Number.isInteger(age) || age < 0 || age > 120) {
    errors.age = "Age must be a whole number from 0 to 120";
  }

  if (!formData.bloodGroup.trim()) {
    errors.bloodGroup = "Blood group is required";
  } else if (!bloodGroupPattern.test(formData.bloodGroup.trim())) {
    errors.bloodGroup = "Use format like A+, B-, AB+, or O-";
  }

  if (!formData.occupation.trim()) {
    errors.occupation = "Occupation is required";
  } else if (formData.occupation.trim().length < 2) {
    errors.occupation = "Occupation must be at least 2 characters";
  }

  return errors;
};

export const hasValidationErrors = (errors) => Object.keys(errors).length > 0;
