import { TRequestWithUser } from '@/interfaces/common.type';
import { SubjectService } from '@/services';
import { catchAsync } from '@/utils/catch-async';
import { StatusCodes } from 'http-status-codes';
import Container from 'typedi';

export class SubjectController {
  private readonly subjectService = Container.get(SubjectService);

  public getAllSubjects = catchAsync(async (req, res) => {
    const data = await this.subjectService.getAllSubjects(req.query as any);
    res.status(StatusCodes.OK).json({
      data,
      message: 'Get all subjects successfully',
    });
  });

  public getSubjectById = catchAsync(async (req, res) => {
    const subject = await this.subjectService.getSubjectById(req.params.id);
    res.status(StatusCodes.OK).json({
      data: subject,
      message: 'Get subject successfully',
    });
  });

  public createSubject = catchAsync(async (req, res) => {
    const subject = await this.subjectService.createSubject(req.body);
    res.status(StatusCodes.CREATED).json({
      data: subject,
      message: `Create subject successfully`,
    });
  });

  public updateSubject = catchAsync(async (req, res) => {
    const subject = await this.subjectService.updateSubject(req.params.id, req.body);
    res.status(StatusCodes.OK).json({
      data: subject,
      message: `Update subject successfully`,
    });
  });

  public deleteSubject = catchAsync(async (req, res) => {
    const subject = await this.subjectService.deleteSubject(req.params.id);
    res.status(StatusCodes.OK).json({
      data: subject,
      message: `Delete subject successfully`,
    });
  });

  public getAverageScore = catchAsync(async (req, res) => {
    const mssv = req.params.mssv as string;

    const data = await this.subjectService.getAverageScoreByMssv(mssv);

    res.status(StatusCodes.OK).json({
      data,
      message: `Get average score successfully`,
    });
  });

  public getSubjectNotRegister = catchAsync(async (req: TRequestWithUser, res) => {
    const mssv = req.user.username;

    const data = await this.subjectService.getAllSubjectsNotOwnedByMssv(mssv);

    res.status(StatusCodes.OK).json({
      data,
      message: `Get subject not register successfully`,
    });
  });

  public registerSubject = catchAsync(async (req: TRequestWithUser, res) => {
    const mssv = req.user.username;

    const data = await this.subjectService.addSubjectToStudent(mssv, req.body);

    res.status(StatusCodes.OK).json({
      data,
      message: `Register subjects successfully`,
    });
  });
}
