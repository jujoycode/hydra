import type { CommentRecord } from '../database/repository/interfaces/CommentRepository'
import type { FileRecord } from '../database/repository/interfaces/FileRepository'
import type { IntegrationRecord } from '../database/repository/interfaces/IntegrationRepository'
import type { IssueRelationRecord } from '../database/repository/interfaces/IssueRelationRepository'
import type { IssueRecord } from '../database/repository/interfaces/IssueRepository'
import type { LabelRecord } from '../database/repository/interfaces/LabelRepository'
import type { MilestoneRecord } from '../database/repository/interfaces/MilestoneRepository'
import type { NotificationRecord } from '../database/repository/interfaces/NotificationRepository'
import type { ProjectRecord } from '../database/repository/interfaces/ProjectRepository'
import type { TaskRecord } from '../database/repository/interfaces/TaskRepository'
import type { SafeUser } from '../database/repository/interfaces/UserRepository'
import type {
  AuthDeleteUserParams,
  AuthUpdateUserParams,
  CreateMemberParams,
  LoginParams,
  SessionStatusResponse,
  SetupAdminParams
} from './types/auth'
import type { CreateCommentParams, DeleteCommentParams, ListCommentsParams, UpdateCommentParams } from './types/comment'
import type { DeleteIntegrationParams, SaveIntegrationParams, TestSlackWebhookParams } from './types/integration'
import type { InviteApplyParams, InviteCodeInfo, InviteGenerateParams } from './types/invite'
import type {
  CreateIssueParams,
  DeleteIssueParams,
  GetIssueParams,
  ListAssignedIssuesParams,
  ListIssueParams,
  ListMemberProjectIssuesParams,
  UpdateIssueParams
} from './types/issue'
import type {
  CreateIssueRelationParams,
  DeleteIssueRelationParams,
  ListIssueRelationsParams
} from './types/issueRelation'
import type {
  CreateLabelParams,
  DeleteLabelParams,
  LinkLabelParams,
  ListIssueLabelParams,
  UpdateLabelParams
} from './types/label'
import type {
  CreateMilestoneParams,
  DeleteMilestoneParams,
  ListMilestonesParams,
  UpdateMilestoneParams
} from './types/milestone'
import type {
  CountUnreadParams,
  DeleteNotificationParams,
  ListNotificationsParams,
  MarkAllNotificationsReadParams,
  MarkNotificationReadParams
} from './types/notification'
import type {
  CreateProjectParams,
  DeleteProjectParams,
  GetProjectParams,
  ListProjectMembersParams,
  ListProjectParams,
  UpdateProjectParams
} from './types/project'
import type { LinkFileParams, ListIssueFilesParams, UploadFileParams } from './types/storage'
import type { OpenDialogOptions, OpenDialogReturnValue } from './types/system'
import type { CreateTaskParams, DeleteTaskParams, ListTasksParams, UpdateTaskParams } from './types/task'
import type {
  WorkspaceConfig,
  WorkspaceConnectParams,
  WorkspaceDeleteParams,
  WorkspaceSaveParams,
  WorkspaceStatusResponse
} from './types/workspace'

/**
 * IpcChannel
 * @desc Ipc 채널 정의
 */
export enum IpcChannel {
  // WORKSPACE-
  WORKSPACE_LIST = 'workspaceList',
  WORKSPACE_SAVE = 'workspaceSave',
  WORKSPACE_DELETE = 'workspaceDelete',
  WORKSPACE_CONNECT = 'workspaceConnect',
  WORKSPACE_DISCONNECT = 'workspaceDisconnect',
  WORKSPACE_STATUS = 'workspaceStatus',

  // AUTH-
  AUTH_UPDATE_USER = 'authUpdateUser',
  AUTH_DELETE_USER = 'authDeleteUser',
  AUTH_CREATE_MEMBER = 'authCreateMember',
  AUTH_LIST_USERS = 'authListUsers',
  AUTH_LOGIN = 'authLogin',
  AUTH_LOGOUT = 'authLogout',
  AUTH_SETUP_ADMIN = 'authSetupAdmin',
  AUTH_SESSION_STATUS = 'authSessionStatus',

  // INVITE-
  INVITE_GENERATE = 'inviteGenerate',
  INVITE_APPLY = 'inviteApply',

  // PROJECT-
  PROJECT_CREATE = 'projectCreate',
  PROJECT_LIST = 'projectList',
  PROJECT_LIST_MEMBERS = 'projectListMembers',
  PROJECT_GET = 'projectGet',
  PROJECT_UPDATE = 'projectUpdate',
  PROJECT_DELETE = 'projectDelete',

  // ISSUE-
  ISSUE_CREATE = 'issueCreate',
  ISSUE_LIST = 'issueList',
  ISSUE_LIST_ASSIGNED = 'issueListAssigned',
  ISSUE_LIST_MEMBER_PROJECTS = 'issueListMemberProjects',
  ISSUE_GET = 'issueGet',
  ISSUE_UPDATE = 'issueUpdate',
  ISSUE_DELETE = 'issueDelete',

  // ISSUE_RELATION-
  ISSUE_RELATION_CREATE = 'issueRelationCreate',
  ISSUE_RELATION_LIST = 'issueRelationList',
  ISSUE_RELATION_DELETE = 'issueRelationDelete',

  // COMMENT-
  COMMENT_CREATE = 'commentCreate',
  COMMENT_LIST = 'commentList',
  COMMENT_UPDATE = 'commentUpdate',
  COMMENT_DELETE = 'commentDelete',

  // LABEL-
  LABEL_CREATE = 'labelCreate',
  LABEL_LIST = 'labelList',
  LABEL_UPDATE = 'labelUpdate',
  LABEL_DELETE = 'labelDelete',
  LABEL_LINK = 'labelLink',
  LABEL_UNLINK = 'labelUnlink',
  LABEL_LIST_BY_ISSUE = 'labelListByIssue',

  // MILESTONE-
  MILESTONE_CREATE = 'milestoneCreate',
  MILESTONE_LIST = 'milestoneList',
  MILESTONE_UPDATE = 'milestoneUpdate',
  MILESTONE_DELETE = 'milestoneDelete',

  // TASK-
  TASK_CREATE = 'taskCreate',
  TASK_LIST = 'taskList',
  TASK_UPDATE = 'taskUpdate',
  TASK_DELETE = 'taskDelete',

  // NOTIFICATION-
  NOTIFICATION_LIST = 'notificationList',
  NOTIFICATION_MARK_READ = 'notificationMarkRead',
  NOTIFICATION_MARK_ALL_READ = 'notificationMarkAllRead',
  NOTIFICATION_DELETE = 'notificationDelete',
  NOTIFICATION_COUNT_UNREAD = 'notificationCountUnread',

  // INTEGRATION-
  INTEGRATION_LIST = 'integrationList',
  INTEGRATION_SAVE = 'integrationSave',
  INTEGRATION_DELETE = 'integrationDelete',
  INTEGRATION_TEST_SLACK = 'integrationTestSlack',

  // STORAGE-
  STORAGE_UPLOAD_FILE = 'storageUploadFile',
  STORAGE_LINK_FILE = 'storageLinkFile',
  STORAGE_UNLINK_FILE = 'storageUnlinkFile',
  STORAGE_LIST_ISSUE_FILES = 'storageListIssueFiles',

  // SYSTEM-
  SYSTEM_OPEN_DIALOG = 'systemOpenDialog'
}

export interface BaseIpcResponse<T> {
  data: T | null
  error: BaseErrorType | null
}

interface BaseIpcPayloads<SendType = unknown, ReceiveType = unknown> {
  [key: string]: {
    send: SendType
    receive: ReceiveType
  }
}

/**
 * IpcPayloads
 * @desc Ipc 페이로드 정의
 */
export interface IpcPayloads extends BaseIpcPayloads {
  // WORKSPACE-
  [IpcChannel.WORKSPACE_LIST]: {
    send: undefined
    receive: BaseIpcResponse<WorkspaceConfig[]>
  }
  [IpcChannel.WORKSPACE_SAVE]: {
    send: WorkspaceSaveParams
    receive: BaseIpcResponse<WorkspaceConfig>
  }
  [IpcChannel.WORKSPACE_DELETE]: {
    send: WorkspaceDeleteParams
    receive: BaseIpcResponse<boolean>
  }
  [IpcChannel.WORKSPACE_CONNECT]: {
    send: WorkspaceConnectParams
    receive: BaseIpcResponse<WorkspaceStatusResponse>
  }
  [IpcChannel.WORKSPACE_DISCONNECT]: {
    send: undefined
    receive: BaseIpcResponse<boolean>
  }
  [IpcChannel.WORKSPACE_STATUS]: {
    send: undefined
    receive: BaseIpcResponse<WorkspaceStatusResponse>
  }

  // AUTH-
  [IpcChannel.AUTH_DELETE_USER]: {
    send: AuthDeleteUserParams
    receive: BaseIpcResponse<null>
  }
  [IpcChannel.AUTH_UPDATE_USER]: {
    send: AuthUpdateUserParams
    receive: BaseIpcResponse<SafeUser>
  }
  [IpcChannel.AUTH_CREATE_MEMBER]: {
    send: CreateMemberParams
    receive: BaseIpcResponse<SafeUser>
  }
  [IpcChannel.AUTH_LIST_USERS]: {
    send: undefined
    receive: BaseIpcResponse<SafeUser[]>
  }
  [IpcChannel.AUTH_LOGIN]: {
    send: LoginParams
    receive: BaseIpcResponse<SafeUser>
  }
  [IpcChannel.AUTH_LOGOUT]: {
    send: undefined
    receive: BaseIpcResponse<boolean>
  }
  [IpcChannel.AUTH_SETUP_ADMIN]: {
    send: SetupAdminParams
    receive: BaseIpcResponse<SafeUser>
  }
  [IpcChannel.AUTH_SESSION_STATUS]: {
    send: undefined
    receive: BaseIpcResponse<SessionStatusResponse>
  }

  // INVITE-
  [IpcChannel.INVITE_GENERATE]: {
    send: InviteGenerateParams
    receive: BaseIpcResponse<{ code: string }>
  }
  [IpcChannel.INVITE_APPLY]: {
    send: InviteApplyParams
    receive: BaseIpcResponse<InviteCodeInfo>
  }

  // PROJECT-
  [IpcChannel.PROJECT_LIST]: {
    send: ListProjectParams
    receive: BaseIpcResponse<ProjectRecord[]>
  }
  [IpcChannel.PROJECT_LIST_MEMBERS]: {
    send: ListProjectMembersParams
    receive: BaseIpcResponse<SafeUser[]>
  }
  [IpcChannel.PROJECT_GET]: {
    send: GetProjectParams
    receive: BaseIpcResponse<ProjectRecord | null>
  }
  [IpcChannel.PROJECT_CREATE]: {
    send: CreateProjectParams
    receive: BaseIpcResponse<ProjectRecord>
  }
  [IpcChannel.PROJECT_UPDATE]: {
    send: UpdateProjectParams
    receive: BaseIpcResponse<ProjectRecord>
  }
  [IpcChannel.PROJECT_DELETE]: {
    send: DeleteProjectParams
    receive: BaseIpcResponse<boolean>
  }

  // ISSUE-
  [IpcChannel.ISSUE_LIST]: {
    send: ListIssueParams
    receive: BaseIpcResponse<IssueRecord[]>
  }
  [IpcChannel.ISSUE_LIST_ASSIGNED]: {
    send: ListAssignedIssuesParams
    receive: BaseIpcResponse<IssueRecord[]>
  }
  [IpcChannel.ISSUE_LIST_MEMBER_PROJECTS]: {
    send: ListMemberProjectIssuesParams
    receive: BaseIpcResponse<IssueRecord[]>
  }
  [IpcChannel.ISSUE_GET]: {
    send: GetIssueParams
    receive: BaseIpcResponse<IssueRecord | null>
  }
  [IpcChannel.ISSUE_CREATE]: {
    send: CreateIssueParams
    receive: BaseIpcResponse<IssueRecord>
  }
  [IpcChannel.ISSUE_UPDATE]: {
    send: UpdateIssueParams
    receive: BaseIpcResponse<IssueRecord>
  }
  [IpcChannel.ISSUE_DELETE]: {
    send: DeleteIssueParams
    receive: BaseIpcResponse<boolean>
  }

  // ISSUE_RELATION-
  [IpcChannel.ISSUE_RELATION_CREATE]: {
    send: CreateIssueRelationParams
    receive: BaseIpcResponse<IssueRelationRecord>
  }
  [IpcChannel.ISSUE_RELATION_LIST]: {
    send: ListIssueRelationsParams
    receive: BaseIpcResponse<IssueRelationRecord[]>
  }
  [IpcChannel.ISSUE_RELATION_DELETE]: {
    send: DeleteIssueRelationParams
    receive: BaseIpcResponse<boolean>
  }

  // COMMENT-
  [IpcChannel.COMMENT_CREATE]: {
    send: CreateCommentParams
    receive: BaseIpcResponse<CommentRecord>
  }
  [IpcChannel.COMMENT_LIST]: {
    send: ListCommentsParams
    receive: BaseIpcResponse<CommentRecord[]>
  }
  [IpcChannel.COMMENT_UPDATE]: {
    send: UpdateCommentParams
    receive: BaseIpcResponse<CommentRecord>
  }
  [IpcChannel.COMMENT_DELETE]: {
    send: DeleteCommentParams
    receive: BaseIpcResponse<boolean>
  }

  // LABEL-
  [IpcChannel.LABEL_CREATE]: {
    send: CreateLabelParams
    receive: BaseIpcResponse<LabelRecord>
  }
  [IpcChannel.LABEL_LIST]: {
    send: undefined
    receive: BaseIpcResponse<LabelRecord[]>
  }
  [IpcChannel.LABEL_UPDATE]: {
    send: UpdateLabelParams
    receive: BaseIpcResponse<LabelRecord>
  }
  [IpcChannel.LABEL_DELETE]: {
    send: DeleteLabelParams
    receive: BaseIpcResponse<boolean>
  }
  [IpcChannel.LABEL_LINK]: {
    send: LinkLabelParams
    receive: BaseIpcResponse<boolean>
  }
  [IpcChannel.LABEL_UNLINK]: {
    send: LinkLabelParams
    receive: BaseIpcResponse<boolean>
  }
  [IpcChannel.LABEL_LIST_BY_ISSUE]: {
    send: ListIssueLabelParams
    receive: BaseIpcResponse<LabelRecord[]>
  }

  // MILESTONE-
  [IpcChannel.MILESTONE_CREATE]: {
    send: CreateMilestoneParams
    receive: BaseIpcResponse<MilestoneRecord>
  }
  [IpcChannel.MILESTONE_LIST]: {
    send: ListMilestonesParams
    receive: BaseIpcResponse<MilestoneRecord[]>
  }
  [IpcChannel.MILESTONE_UPDATE]: {
    send: UpdateMilestoneParams
    receive: BaseIpcResponse<MilestoneRecord>
  }
  [IpcChannel.MILESTONE_DELETE]: {
    send: DeleteMilestoneParams
    receive: BaseIpcResponse<boolean>
  }

  // TASK-
  [IpcChannel.TASK_CREATE]: {
    send: CreateTaskParams
    receive: BaseIpcResponse<TaskRecord>
  }
  [IpcChannel.TASK_LIST]: {
    send: ListTasksParams
    receive: BaseIpcResponse<TaskRecord[]>
  }
  [IpcChannel.TASK_UPDATE]: {
    send: UpdateTaskParams
    receive: BaseIpcResponse<TaskRecord>
  }
  [IpcChannel.TASK_DELETE]: {
    send: DeleteTaskParams
    receive: BaseIpcResponse<boolean>
  }

  // NOTIFICATION-
  [IpcChannel.NOTIFICATION_LIST]: {
    send: ListNotificationsParams
    receive: BaseIpcResponse<NotificationRecord[]>
  }
  [IpcChannel.NOTIFICATION_MARK_READ]: {
    send: MarkNotificationReadParams
    receive: BaseIpcResponse<NotificationRecord>
  }
  [IpcChannel.NOTIFICATION_MARK_ALL_READ]: {
    send: MarkAllNotificationsReadParams
    receive: BaseIpcResponse<boolean>
  }
  [IpcChannel.NOTIFICATION_DELETE]: {
    send: DeleteNotificationParams
    receive: BaseIpcResponse<boolean>
  }
  [IpcChannel.NOTIFICATION_COUNT_UNREAD]: {
    send: CountUnreadParams
    receive: BaseIpcResponse<number>
  }

  // INTEGRATION-
  [IpcChannel.INTEGRATION_LIST]: {
    send: undefined
    receive: BaseIpcResponse<IntegrationRecord[]>
  }
  [IpcChannel.INTEGRATION_SAVE]: {
    send: SaveIntegrationParams
    receive: BaseIpcResponse<IntegrationRecord>
  }
  [IpcChannel.INTEGRATION_DELETE]: {
    send: DeleteIntegrationParams
    receive: BaseIpcResponse<boolean>
  }
  [IpcChannel.INTEGRATION_TEST_SLACK]: {
    send: TestSlackWebhookParams
    receive: BaseIpcResponse<boolean>
  }

  // STORAGE-
  [IpcChannel.STORAGE_UPLOAD_FILE]: {
    send: UploadFileParams
    receive: BaseIpcResponse<FileRecord>
  }
  [IpcChannel.STORAGE_LINK_FILE]: {
    send: LinkFileParams
    receive: BaseIpcResponse<boolean>
  }
  [IpcChannel.STORAGE_UNLINK_FILE]: {
    send: LinkFileParams
    receive: BaseIpcResponse<boolean>
  }
  [IpcChannel.STORAGE_LIST_ISSUE_FILES]: {
    send: ListIssueFilesParams
    receive: BaseIpcResponse<FileRecord[]>
  }

  // SYSTEM-
  [IpcChannel.SYSTEM_OPEN_DIALOG]: {
    send: OpenDialogOptions
    receive: BaseIpcResponse<OpenDialogReturnValue>
  }
}

/**
 * IpcRequest & IpcResponse
 * @desc Ipc 요청 및 응답 타입
 */
export type IpcRequest<T extends IpcChannel> = IpcPayloads[T]['send']
export type IpcResponse<T extends IpcChannel> = IpcPayloads[T]['receive']

export enum ErrorCode {
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  DB_ERROR = 'DB_ERROR',
  AUTH_ERROR = 'AUTH_ERROR',
  STORAGE_ERROR = 'STORAGE_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  NOT_FOUND_ERROR = 'NOT_FOUND_ERROR',
  PERMISSION_ERROR = 'PERMISSION_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR',
  OPERATION_FAILED_ERROR = 'OPERATION_FAILED_ERROR',
  UNKNOWN_ERROR = 'UNKNOWN_ERROR'
}

export interface BaseErrorType {
  code: ErrorCode
  message: string
  data: unknown | null
}
