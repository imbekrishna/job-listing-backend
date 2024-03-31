import { body } from "express-validator";

/* 
company: Yup.string().required("Required"),
  logo: Yup.string().required("Required").url("Must be a valid url"),
  position: Yup.string().required("Required"),
  role: Yup.string().required("Required"),
  level: Yup.string()
    .required("Required")
    .oneOf(["senior", "junior", "midweight", "intern"]),
  contract: Yup.string()
    .required("Required")
    .oneOf(["full_time", "part_time", "contract"]),
  location: Yup.string().required("Required"),
  languages: Yup.array()
    .of(Yup.string())
    .min(2, "Select at least 2 languages"),
  skills: Yup.array()
    .of(Yup.string())
    .min(2, "Select at least 2 skills"),
  aboutCompany: Yup.string()
    .required("Required")
    .min(50, "Minimum 50 chars required"),
  aboutPosition: Yup.string()
    .required("Required")
    .min(50, "Minimum 50 chars required"),
  additionalInfo: Yup.string().min(10, "Minimum 10 chars required"),
*/

export const createJobValidator = [
  body("company")
    .isString()
    .notEmpty()
    .withMessage("Company name is required."),
  body("logo").isURL().notEmpty().withMessage("Logo url is required."),
  body("role").notEmpty().withMessage("Role is required"),
  body("level")
    .notEmpty()
    .isIn(["senior", "junior", "midweight", "intern"])
    .withMessage(
      "Level is required. Must be one of senior, junior, midweight, intern."
    ),
  body("contract")
    .notEmpty()
    .isIn(["full_time", "part_time", "contract"])
    .withMessage(
      "Contract is required. Must be one of full_time, part_time, contract."
    ),
  body("location").notEmpty().withMessage("Location is required."),
  body("languages")
    .isArray({ min: 2 })
    .withMessage("Must select two languages."),
  body("skills").isArray({ min: 2 }).withMessage("Must select two skills."),
  body("aboutCompany")
    .isString()
    .isLength({ min: 50 })
    .withMessage("About Company is required. Minimimum 50 chars required."),
  body("aboutPosition")
    .isString()
    .isLength({ min: 50 })
    .withMessage("About Position is required. Minimimum 50 chars required."),
  body("additionalInfo")
    .isString()
    .isLength({ min: 10 })
    .withMessage("Additional Info is required. Minimimum 10 chars required."),
];

export const putPatchJobValidator = [
  ...createJobValidator,
  body("refUserId").isString().notEmpty().withMessage("RefUserId is required."),
];
