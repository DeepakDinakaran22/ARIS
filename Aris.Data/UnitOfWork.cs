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
