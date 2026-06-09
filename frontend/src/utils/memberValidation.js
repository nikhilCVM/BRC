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

  if (!formData.flatNo.trim()) {
    errors.flatNo = "Flat No is required";
  }

  if (formData.phone.trim() && !phonePattern.test(formData.phone.trim())) {
    errors.phone = "Enter a valid phone number";
  }

  if (formData.age !== "" && (!Number.isInteger(age) || age < 0 || age > 120)) {
    errors.age = "Age must be a whole number from 0 to 120";
  }

  if (
    formData.bloodGroup.trim() &&
    !bloodGroupPattern.test(formData.bloodGroup.trim())
  ) {
    errors.bloodGroup = "Use format like A+, B-, AB+, or O-";
  }

  return errors;
};

export const hasValidationErrors = (errors) => Object.keys(errors).length > 0;
