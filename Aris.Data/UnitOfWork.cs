using Aris.Data.Entities;
using System;

namespace Aris.Data
{
    public class UnitOfWork : IDisposable
    {
        private ArisContext context = new ArisContext();
        private GenericRepository<Users> userRepository;
        private GenericRepository<UserType> userTypeRepository;
        private GenericRepository<Company> companyRepository ;
        private GenericRepository<DocumentCategory> documentCategoryRepository;
        private GenericRepository<DocumentType> documentTypeRepository;
        private GenericRepository<EmployeeDetails> employeeDetailsRepository;
        private GenericRepository<EmployeeFileUploads> employeeFileUploadsRepository;
        private GenericRepository<OfficeDocDetails> officeDocDetailsRepository;
        private GenericRepository<OfficeDocsFileUploads> officeDocsFileUploadsRepository;
        private GenericRepository<CompanyFileUploads> companyFileUploadsRepository;
        private GenericRepository<Salary> salaryRepository;

        public GenericRepository<Users> UserRepository

        {
            get
            {
                if (this.userRepository == null)
                    this.userRepository = new GenericRepository<Users>(context);
                return this.userRepository;

            }

        }
        public GenericRepository<UserType> UserTypeRepository
        {
            get
            {
                if (this.userTypeRepository == null)
                    this.userTypeRepository = new GenericRepository<UserType>(context);
                return this.userTypeRepository;

            }

        }


        public GenericRepository<Company> CompanyRepository
        {
            get
            {
                if (this.companyRepository == null)
                    this.companyRepository = new GenericRepository<Company>(context);
                return this.companyRepository;

            }

        }

        public GenericRepository<DocumentCategory> DocumentCategoryRepository
        {
            get
            {
                if (this.documentCategoryRepository == null)
                    this.documentCategoryRepository = new GenericRepository<DocumentCategory>(context);
                return this.documentCategoryRepository;

            }

        }


        public GenericRepository<DocumentType> DocumentTypeRepository
        {
            get
            {
                if (this.documentTypeRepository == null)
                    this.documentTypeRepository = new GenericRepository<DocumentType>(context);
                return this.documentTypeRepository;

            }

        }

        public GenericRepository<EmployeeDetails> EmployeeDetailsRepository
        {
            get
            {
                if (this.employeeDetailsRepository == null)
                    this.employeeDetailsRepository = new GenericRepository<EmployeeDetails>(context);
                return this.employeeDetailsRepository;

            }

        }
        public GenericRepository<EmployeeFileUploads> EmployeeFileUploadsRepository
        {
            get
            {
                if (this.employeeFileUploadsRepository == null)
                    this.employeeFileUploadsRepository = new GenericRepository<EmployeeFileUploads>(context);
                return this.employeeFileUploadsRepository;

            }

        }
        public GenericRepository<OfficeDocDetails> OfficeDocDetailsRepository
        {
            get
            {
                if (this.officeDocDetailsRepository == null)
                    this.officeDocDetailsRepository = new GenericRepository<OfficeDocDetails>(context);
                return this.officeDocDetailsRepository;
            }

        }
        public GenericRepository<OfficeDocsFileUploads> OfficeDocsFileUploadsRepository
        {
            get
            {
                if (this.officeDocsFileUploadsRepository == null)
                    this.officeDocsFileUploadsRepository = new GenericRepository<OfficeDocsFileUploads>(context);
                return this.officeDocsFileUploadsRepository;
            }

        }
        public GenericRepository<CompanyFileUploads> CompanyFileUploadsRepository
        {
            get
            {
                if (this.companyFileUploadsRepository == null)
                    this.companyFileUploadsRepository = new GenericRepository<CompanyFileUploads>(context);
                return this.companyFileUploadsRepository;
            }

        }
        public GenericRepository<Salary> SalaryRepository
        {
            get
            {
                if (this.salaryRepository == null)
                    this.salaryRepository = new GenericRepository<Salary>(context);
                return this.salaryRepository;
            }
        }


        public void Save()
        {
            context.SaveChanges();
        }
        private bool disposed = false;
        protected virtual void Dispose(bool disposing)
        {
            if (!this.disposed)
            {
                if (disposing)
                {
                    context.Dispose();
                }
            }
            this.disposed = true;
        }
        public void Dispose()
        {
            Dispose(true);
            GC.SuppressFinalize(this);
        }
    }
}
