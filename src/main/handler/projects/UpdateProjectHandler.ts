import { IpcChannel, type UpdateProjectParams, type projects } from '@interface/CoreInterface'
import { CoreBaseHandler } from '@base/CoreBaseHandler'
import { ProjectValidation } from '@util/validation'

export class UpdateProjectHandler extends CoreBaseHandler<ProjectValidation> {
  constructor() {
    super(IpcChannel.PROJECT_UPDATE, ProjectValidation)
  }

  async handler(params: UpdateProjectParams): Promise<projects> {
    this.logDebug(`UpdateProjectHandler Params: ${JSON.stringify(params)}`)

    // 1. 프로젝트 업데이트 전 체크 (중복명 체크)
    await this.validator?.checkUpdateProject(params.projectName)

    // 2. 프로젝트 업데이트 (public.projects)
    const project = await this.getHydraDb().projects.update({
      where: {
        project_id: params.projectId
      },
      data: {
        project_name: params.projectName,
        project_desc: params.projectDescription,
        project_modified_by: params.userId
      }
    })

    /**
     * TODO: 프로젝트 생성 결과 반환 시, start_date, end_date timezone 보정
     */
    return project
  }
}
