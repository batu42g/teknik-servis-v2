-- Önce mevcut status değerlerini yeni enum değerlerine uygun hale getiriyoruz
UPDATE "Appointment"
SET status = CASE 
    WHEN status = 'pending' THEN 'PENDING'
    WHEN status = 'confirmed' THEN 'CONFIRMED'
    WHEN status = 'completed' THEN 'IN_PROGRESS'
    WHEN status = 'cancelled' THEN 'CANCELLED'
    ELSE 'PENDING'
END;

-- Sonra status kolonunu enum tipine çeviriyoruz
ALTER TABLE "Appointment" ALTER COLUMN "status" TYPE "AppointmentStatus" USING (status::text::"AppointmentStatus"); 