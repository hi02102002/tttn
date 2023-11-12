-- CreateTable
CREATE TABLE `User` (
    `user_id` VARCHAR(191) NOT NULL,
    `username` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `full_name` VARCHAR(191) NULL,
    `status` ENUM('ACTIVE', 'BLOCKED') NOT NULL DEFAULT 'ACTIVE',

    UNIQUE INDEX `User_username_key`(`username`),
    PRIMARY KEY (`user_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `roles` (
    `role_id` VARCHAR(191) NOT NULL,
    `name` ENUM('ADMIN', 'STUDENT') NOT NULL,

    UNIQUE INDEX `roles_name_key`(`name`),
    PRIMARY KEY (`role_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `user_roles` (
    `user_id` VARCHAR(191) NOT NULL,
    `role_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`user_id`, `role_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `files` (
    `file_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `url` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `files_name_key`(`name`),
    UNIQUE INDEX `files_url_key`(`url`),
    UNIQUE INDEX `files_userId_key`(`userId`),
    PRIMARY KEY (`file_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `subjects` (
    `subject_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `num_credits` INTEGER NOT NULL,
    `deleted_at` DATETIME(3) NULL,

    UNIQUE INDEX `subjects_name_key`(`name`),
    UNIQUE INDEX `subjects_name_deleted_at_key`(`name`, `deleted_at`),
    PRIMARY KEY (`subject_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `classes` (
    `class_id` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `academic_year` INTEGER NOT NULL,

    UNIQUE INDEX `classes_name_key`(`name`),
    UNIQUE INDEX `classes_name_academic_year_key`(`name`, `academic_year`),
    PRIMARY KEY (`class_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `students` (
    `mssv` VARCHAR(191) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `address` VARCHAR(191) NOT NULL,
    `class_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`mssv`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `scores` (
    `score_id` VARCHAR(191) NOT NULL,
    `score` DOUBLE NULL,
    `mssv` VARCHAR(191) NOT NULL,
    `subject_id` VARCHAR(191) NOT NULL,

    UNIQUE INDEX `scores_mssv_subject_id_key`(`mssv`, `subject_id`),
    PRIMARY KEY (`score_id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `user_roles` ADD CONSTRAINT `user_roles_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `user_roles` ADD CONSTRAINT `user_roles_role_id_fkey` FOREIGN KEY (`role_id`) REFERENCES `roles`(`role_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `files` ADD CONSTRAINT `files_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`user_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `students` ADD CONSTRAINT `students_class_id_fkey` FOREIGN KEY (`class_id`) REFERENCES `classes`(`class_id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `students` ADD CONSTRAINT `students_user_id_fkey` FOREIGN KEY (`user_id`) REFERENCES `User`(`user_id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `scores` ADD CONSTRAINT `scores_mssv_fkey` FOREIGN KEY (`mssv`) REFERENCES `students`(`mssv`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `scores` ADD CONSTRAINT `scores_subject_id_fkey` FOREIGN KEY (`subject_id`) REFERENCES `subjects`(`subject_id`) ON DELETE RESTRICT ON UPDATE CASCADE;
