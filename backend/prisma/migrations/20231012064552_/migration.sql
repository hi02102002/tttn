-- DropForeignKey
ALTER TABLE `user` DROP FOREIGN KEY `User_studentId_fkey`;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_studentId_fkey` FOREIGN KEY (`studentId`) REFERENCES `students`(`mssv`) ON DELETE CASCADE ON UPDATE CASCADE;
