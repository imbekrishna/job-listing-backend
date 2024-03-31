export interface CreateJobDto {
  id: string;
  company: string;
  logo: string;
  new: true;
  featured: true;
  position: string;
  role: string;
  level: string;
  postedAt: string;
  contract: string;
  location: string;
  languages: string[];
  skills: string[];
  aboutCompany: string;
  aboutPosition: string;
  additionalInfo: string;
  refUserId: string;
}
