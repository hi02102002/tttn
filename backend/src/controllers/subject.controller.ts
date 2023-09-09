import { SubjectService } from '@/services';
import { catchAsync } from '@/utils/catch-async';
import { StatusCodes } from 'http-status-codes';
import Container from 'typedi';

export class SubjectController {
  private readonly subjectService = Container.get(SubjectService);

  public getAllSubjects = catchAsync(async (req, res) => {
    const subjects = await this.subjectService.getAllSubjects(req.query as any);
    res.status(StatusCodes.OK).json({
      data: subjects,
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
      message: `Create subject with name ${subject.name} successfully`,
    });
  });

  public updateSubject = catchAsync(async (req, res) => {
    const subject = await this.subjectService.updateSubject(req.params.id, req.body);
    res.status(StatusCodes.OK).json({
      data: subject,
      message: `Update subject ${subject.name} successfully`,
    });
  });

  public deleteSubject = catchAsync(async (req, res) => {
    const subject = await this.subjectService.deleteSubject(req.params.id);
    res.status(StatusCodes.OK).json({
      data: subject,
      message: `Delete subject ${subject.name} successfully`,
    });
  });
}
