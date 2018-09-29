using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
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

        public virtual DbSet<ApiLogger> ApiLogger { get; set; }
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
            modelBuilder.Entity<ApiLogger>(entity =>
            {
                entity.ToTable("apiLogger");

                entity.Property(e => e.Id).ValueGeneratedNever();

                entity.Property(e => e.RequestDate).HasColumnType("datetime");

                entity.Property(e => e.RequestUrl).HasMaxLength(500);

                entity.Property(e => e.ResponseDate).HasColumnType("datetime");
            });

            modelBuilder.Entity<City>(entity =>
            {
                entity.HasKey(e => e.IdCity);

                entity.Property(e => e.City1)
                    .IsRequired()
                    .HasColumnName("City")
                    .HasMaxLength(400);

                entity.Property(e => e.CountryCode)
                    .IsRequired()
                    .HasMaxLength(2);

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
