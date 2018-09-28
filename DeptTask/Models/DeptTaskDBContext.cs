using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;

namespace DeptTask.Models
{
    public partial class DeptTaskDBContext : DbContext
    {
        readonly IConfiguration _iConfiguration;
        public DeptTaskDBContext()
        {
        }

        public DeptTaskDBContext(DbContextOptions<DeptTaskDBContext> options, IConfiguration iConfiguration)
            : base(options)
        {
            _iConfiguration = iConfiguration;
        }

        public virtual DbSet<City> City { get; set; }
        public virtual DbSet<Country> Country { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
                optionsBuilder.UseSqlServer(_iConfiguration.GetConnectionString("DefaultConnection"));
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<City>(entity =>
            {
                entity.HasKey(e => new { e.City1, e.CountryCode });

                entity.Property(e => e.City1)
                    .HasColumnName("City")
                    .HasMaxLength(400);

                entity.Property(e => e.CountryCode).HasMaxLength(2);

                entity.HasOne(d => d.CountryCodeNavigation)
                    .WithMany(p => p.City)
                    .HasForeignKey(d => d.CountryCode)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_City_Country");
            });

            modelBuilder.Entity<Country>(entity =>
            {
                entity.HasKey(e => e.Code);

                entity.Property(e => e.Code)
                    .HasMaxLength(2)
                    .ValueGeneratedNever();

                entity.Property(e => e.Name)
                    .IsRequired()
                    .HasMaxLength(600);
            });
        }
    }
}
