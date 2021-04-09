using Aris.Data.Entities;
using Microsoft.EntityFrameworkCore;

namespace Aris.Data
{
    public class ArisContext : DbContext
    {
        public ArisContext()
        {
        }
        public ArisContext(DbContextOptions<ArisContext> options) : base(options)
        {

        }

        public virtual DbSet<Users> Users { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Users>(entity =>
            {
                entity.HasKey(e => e.UserId);

                entity.Property(e => e.UserId)
                .HasColumnName("UserId");

                entity.Property(e => e.FullName)
                .HasColumnName("FullName");

                entity.Property(e => e.UserName)
                .HasColumnName("UserName");

                entity.Property(e => e.IsActive)
                .HasColumnName("IsActive");

                entity.Property(e => e.UserImage)
               .HasColumnName("UserImage");

                entity.Property(e => e.UserTypeID)
               .HasColumnName("UserTypeID");

                entity.Property(e => e.CreatedBy)
               .HasColumnName("CreatedBy");

                entity.Property(e => e.CreatedDate)
               .HasColumnName("CreatedDate");

                entity.Property(e => e.ModifiedBy)
               .HasColumnName("ModifiedBy");

                entity.Property(e => e.ModifiedDate)
               .HasColumnName("ModifiedDate");
            });

        }
    }
}