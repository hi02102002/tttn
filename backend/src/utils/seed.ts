import { StudentService } from '@/services';
import { PrismaClient } from '@prisma/client';
import Container from 'typedi';

const db = new PrismaClient();

export const seedSubjects = async () => {
  const subjects = [
    { name: 'Cơ sở lập trình', numCredits: 3 },
    { name: 'Giải tích', numCredits: 4 },
    { name: 'Lập trình nâng cao', numCredits: 3 },
    { name: 'Cấu trúc dữ liệu và giải thuật', numCredits: 3 },
    { name: 'Hệ điều hành', numCredits: 4 },
    { name: 'Mạng máy tính', numCredits: 3 },
    { name: 'Cơ sở dữ liệu', numCredits: 3 },
    { name: 'Trí tuệ nhân tạo', numCredits: 4 },
    { name: 'Phân tích và thiết kế hệ thống', numCredits: 3 },
    { name: 'An toàn thông tin', numCredits: 2 },
    { name: 'Quản lý dự án phần mềm', numCredits: 3 },
    { name: 'Xây dựng ứng dụng di động', numCredits: 3 },
    { name: 'Kiến thức thông tin', numCredits: 3 },
    { name: 'Mạng không dây', numCredits: 4 },
    { name: 'Công nghệ web', numCredits: 3 },
    { name: 'Trình biên dịch', numCredits: 3 },
    { name: 'Công nghệ máy tính', numCredits: 4 },
    { name: 'Khoa học dữ liệu', numCredits: 3 },
    { name: 'Phân tích kỹ thuật phần mềm', numCredits: 3 },
    { name: 'Lập trình hướng đối tượng', numCredits: 4 },
    { name: 'Kỹ thuật phần mềm', numCredits: 3 },
    { name: 'Truyền thông dữ liệu', numCredits: 3 },
    { name: 'Công nghệ trình chiếu', numCredits: 4 },
    { name: 'Kỹ thuật đám mây', numCredits: 3 },
    { name: 'Thiết kế giao diện người dùng', numCredits: 3 },
    { name: 'Kỹ thuật ảnh số', numCredits: 4 },
    { name: 'Thiết kế hệ thống nhúng', numCredits: 3 },
    { name: 'Kỹ thuật dữ liệu lớn', numCredits: 3 },
    { name: 'Học máy', numCredits: 4 },
    { name: 'Lập trình nhúng', numCredits: 3 },
    { name: 'Quản lý dữ liệu', numCredits: 3 },
    { name: 'Kỹ thuật trình diễn', numCredits: 4 },
    { name: 'Công nghệ IoT', numCredits: 3 },
    { name: 'Phân tích và quy trình dữ liệu', numCredits: 3 },
    { name: 'Cơ sở tri thức', numCredits: 4 },
    { name: 'Lập trình mạng', numCredits: 3 },
    { name: 'Phát triển ứng dụng đám mây', numCredits: 3 },
    { name: 'Kỹ thuật di động và ứng dụng', numCredits: 4 },
    { name: 'Công nghệ xử lý ngôn ngữ tự nhiên', numCredits: 3 },
    { name: 'Phát triển phần mềm đám mây', numCredits: 3 },
    { name: 'An toàn và bảo mật mạng', numCredits: 4 },
    { name: 'Kỹ thuật ứng dụng web', numCredits: 3 },
    { name: 'Mạng máy tính và bảo mật', numCredits: 3 },
    { name: 'Cơ sở dữ liệu phân tán', numCredits: 4 },
    { name: 'Kỹ thuật hệ thống điều khiển', numCredits: 3 },
    { name: 'Công nghệ ảnh số', numCredits: 3 },
    { name: 'Kỹ thuật ứng dụng di động', numCredits: 4 },
    { name: 'Công nghệ trí tuệ nhân tạo', numCredits: 3 },
    { name: 'Quản lý dự án công nghệ thông tin', numCredits: 3 },
    { name: 'Lập trình ứng dụng đám mây', numCredits: 4 },
    { name: 'Kỹ thuật truyền thông', numCredits: 3 },
    { name: 'Cơ sở kiến thức thông tin', numCredits: 3 },
    { name: 'Công nghệ mạng không dây', numCredits: 4 },
    { name: 'Lập trình ứng dụng web', numCredits: 3 },
    { name: 'Công nghệ trình bày', numCredits: 3 },
    { name: 'Lập trình máy tính', numCredits: 4 },
    { name: 'Kỹ thuật học máy', numCredits: 3 },
    { name: 'Phân tích kỹ thuật ảnh số', numCredits: 3 },
    { name: 'Công nghệ thiết kế hệ thống nhúng', numCredits: 4 },
    { name: 'Lập trình IoT', numCredits: 3 },
    { name: 'Kỹ thuật dữ liệu lớn và phân tích', numCredits: 3 },
    { name: 'Công nghệ xử lý ngôn ngữ tự nhiên', numCredits: 4 },
    { name: 'Thiết kế giao diện người dùng đa phương tiện', numCredits: 3 },
  ];

  await db.subject.createMany({
    data: subjects,
    skipDuplicates: true,
  });
};

export const seedClasses = async () => {
  const classes = [
    {
      name: 'CN20A',
      academicYear: 2020,
    },
    {
      name: 'CN20B',
      academicYear: 2020,
    },
    {
      name: 'CN21A',
      academicYear: 2021,
    },
    {
      name: 'CN21B',
      academicYear: 2021,
    },
    {
      name: 'KT22A',
      academicYear: 2022,
    },
    {
      name: 'KT22B',
      academicYear: 2022,
    },
    {
      name: 'KT23A',
      academicYear: 2023,
    },
    {
      name: 'KT23B',
      academicYear: 2023,
    },
    {
      name: 'KT24A',
      academicYear: 2024,
    },
    {
      name: 'KT24B',
      academicYear: 2024,
    },
    {
      name: 'HH25A',
      academicYear: 2025,
    },
    {
      name: 'HH25B',
      academicYear: 2025,
    },
    {
      name: 'LG26A',
      academicYear: 2026,
    },
    {
      name: 'LG26B',
      academicYear: 2026,
    },
    {
      name: 'AT27A',
      academicYear: 2027,
    },
    {
      name: 'AT27B',
      academicYear: 2027,
    },
  ];

  await db.class.createMany({
    data: classes,
    skipDuplicates: true,
  });
};

export const seedStudents = async () => {
  const student = [
    {
      name: 'Nguyễn Văn A',
      address: '123 Đường Trần Phú, Quận Hoàn Kiếm, Hà Nội',
    },
    {
      name: 'Trần Thị B',
      address: '456 Đường Lê Lợi, Quận Sơn Trà, Đà Nẵng',
    },
    {
      name: 'Lê Văn C',
      address: '789 Đường Nguyễn Huệ, Quận 1, TP.HCM',
    },
    {
      name: 'Phạm Thị D',
      address: '101 Đường Hùng Vương, TP. Huế',
    },
    {
      name: 'Hoàng Văn E',
      address: '888 Đường Nguyễn Đình Chính, Quận Tân Bình, TP.HCM',
    },
    {
      name: 'Vũ Thị F',
      address: '456 Đường Lý Thường Kiệt, Quận Cẩm Lệ, Đà Nẵng',
    },
    {
      name: 'Trịnh Văn G',
      address: '333 Đường 30/4, Quận Ninh Kiều, Cần Thơ',
    },
    {
      name: 'Đinh Thị H',
      address: '101 Đường Phan Đăng Lưu, Quận An Hải Đông, Đà Nẵng',
    },
    {
      name: 'Mai Văn I',
      address: '555 Đường Lý Tự Trọng, Quận 1, TP.HCM',
    },
    {
      name: 'Đặng Văn K',
      address: '789 Đường Lê Hồng Phong, Quận Ngô Quyền, Hải Phòng',
    },
    {
      name: 'Nguyễn Thị L',
      address: '222 Đường Bà Triệu, Quận Hai Bà Trưng, Hà Nội',
    },
    {
      name: 'Trần Văn M',
      address: '333 Đường Nguyễn Công Trứ, Quận Hải Châu, Đà Nẵng',
    },
    {
      name: 'Lê Thị N',
      address: '444 Đường Trường Sa, Quận Ngũ Hành Sơn, Đà Nẵng',
    },
    {
      name: 'Phạm Văn O',
      address: '555 Đường Hai Bà Trưng, Quận 3, TP.HCM',
    },
    {
      name: 'Hoàng Thị P',
      address: '666 Đường Lý Thường Kiệt, Quận Cẩm Lệ, Đà Nẵng',
    },
    {
      name: 'Vũ Văn Q',
      address: '777 Đường Bạch Đằng, Quận Hoàn Kiếm, Hà Nội',
    },
    {
      name: 'Trịnh Văn R',
      address: '888 Đường Lê Hồng Phong, Quận Ngô Quyền, Hải Phòng',
    },
    {
      name: 'Đinh Thị S',
      address: '999 Đường Đống Đa, Quận Đống Đa, Hà Nội',
    },
    {
      name: 'Mai Văn T',
      address: '111 Đường Hoàng Hoa Thám, Quận Tân Bình, TP.HCM',
    },
    {
      name: 'Nguyễn Thị U',
      address: '222 Đường Hồ Tùng Mậu, Quận Sơn Trà, Đà Nẵng',
    },
    {
      name: 'Trần Văn V',
      address: '333 Đường 3/2, Quận Ninh Kiều, Cần Thơ',
    },
    {
      name: 'Lê Văn X',
      address: '444 Đường Nguyễn Công Trứ, Quận Hải Châu, Đà Nẵng',
    },
    {
      name: 'Phạm Thị Y',
      address: '555 Đường Bà Triệu, Quận Hai Bà Trưng, Hà Nội',
    },
    {
      name: 'Hoàng Thị Z',
      address: '666 Đường Trường Sa, Quận Ngũ Hành Sơn, Đà Nẵng',
    },
    {
      name: 'Vũ Thị X',
      address: '777 Đường Trần Phú, Quận Hoàn Kiếm, Hà Nội',
    },
    {
      name: 'Nguyễn Văn Y',
      address: '888 Đường Lê Lợi, Quận Sơn Trà, Đà Nẵng',
    },
    {
      name: 'Trần Văn Z',
      address: '999 Đường Đống Đa, Quận Đống Đa, Hà Nội',
    },
    {
      name: 'Trần Văn V',
      address: '333 Đường 3/2, Quận Ninh Kiều, Cần Thơ',
    },
    {
      name: 'Lê Văn X',
      address: '444 Đường Nguyễn Công Trứ, Quận Hải Châu, Đà Nẵng',
    },
    {
      name: 'Phạm Thị Y',
      address: '555 Đường Bà Triệu, Quận Hai Bà Trưng, Hà Nội',
    },
    {
      name: 'Hoàng Thị Z',
      address: '666 Đường Trường Sa, Quận Ngũ Hành Sơn, Đà Nẵng',
    },
    {
      name: 'Vũ Thị X',
      address: '777 Đường Trần Phú, Quận Hoàn Kiếm, Hà Nội',
    },
    {
      name: 'Nguyễn Văn Y',
      address: '888 Đường Lê Lợi, Quận Sơn Trà, Đà Nẵng',
    },
    {
      name: 'Trần Văn Z',
      address: '999 Đường Đống Đa, Quận Đống Đa, Hà Nội',
    },
    {
      name: 'Lê Thị A',
      address: '123 Đường Trần Phú, Quận Hoàn Kiếm, Hà Nội',
    },
    {
      name: 'Phạm Văn B',
      address: '456 Đường Lê Lợi, Quận Sơn Trà, Đà Nẵng',
    },
    {
      name: 'Hoàng Thị C',
      address: '789 Đường Nguyễn Huệ, Quận 1, TP.HCM',
    },
    {
      name: 'Mai Văn D',
      address: '101 Đường Hùng Vương, TP. Huế',
    },
    {
      name: 'Vũ Thị E',
      address: '888 Đường Nguyễn Đình Chính, Quận Tân Bình, TP.HCM',
    },
    {
      name: 'Nguyễn Văn F',
      address: '456 Đường Lý Thường Kiệt, Quận Cẩm Lệ, Đà Nẵng',
    },
    {
      name: 'Trần Thị G',
      address: '333 Đường 30/4, Quận Ninh Kiều, Cần Thơ',
    },
    {
      name: 'Lê Thị H',
      address: '101 Đường Phan Đăng Lưu, Quận An Hải Đông, Đà Nẵng',
    },
    {
      name: 'Phạm Văn I',
      address: '555 Đường Lý Tự Trọng, Quận 1, TP.HCM',
    },
    {
      name: 'Mai Thị K',
      address: '789 Đường Lê Hồng Phong, Quận Ngô Quyền, Hải Phòng',
    },
    {
      name: 'Nguyễn Văn L',
      address: '222 Đường Bà Triệu, Quận Hai Bà Trưng, Hà Nội',
    },
    {
      name: 'Trần Thị M',
      address: '333 Đường Nguyễn Công Trứ, Quận Hải Châu, Đà Nẵng',
    },
    {
      name: 'Lê Văn N',
      address: '444 Đường Trường Sa, Quận Ngũ Hành Sơn, Đà Nẵng',
    },
  ];
  const classess = await db.class.findMany();

  const randomClassId = () => {
    return classess[Math.floor(Math.random() * classess.length)].id;
  };

  const studentService = Container.get(StudentService);

  for (const s of student) {
    try {
      await studentService.createStudent({
        name: s.name,
        address: s.address,
        classId: randomClassId(),
      });
    } catch (error) {}
  }
};
