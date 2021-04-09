using Aris.Data.Entities;
using System;

namespace Aris.Data
{
    public class UnitOfWork : IDisposable
    {
        private ArisContext context = new ArisContext();
        private GenericRepository<Users> userRepository;

        public GenericRepository<Users> UserRepository
        {
            get
            {
                if (this.userRepository == null)
                    this.userRepository = new GenericRepository<Users>(context);
                return this.userRepository;

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
