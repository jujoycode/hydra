import { CoreBaseHandler } from '@/base/CoreBaseHandler'
import { IpcChannel, type UpdateProjectParams } from '@/interface/CoreInterface'
import { ProjectValidator } from '@/util/validator'

export class UpdateProjectHandler extends CoreBaseHandler<IpcChannel.PROJECT_UPDATE, ProjectValidator> {
  constructor() {
    super(IpcChannel.PROJECT_UPDATE, ProjectValidator)
  }

  async handler(params: UpdateProjectParams) {
    // 1. 프로젝트 업데이트 전 체크 (중복명 체크)
    await this.validator?.checkUpdateProject(params.projectName)

    // 2. 프로젝트 업데이트 (public.projects)
    const project = await this.repos.projects.update(params.projectId, {
      projectName: params.projectName,
      projectDesc: params.projectDesc,
      modifiedBy: params.userId
    })

    /**
     * TODO: 프로젝트 생성 결과 반환 시, start_date, end_date timezone 보정
     */
    return { data: project, error: null }
  }
}
