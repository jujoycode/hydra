import type { LabelRecord } from '../../database/repository/interfaces/LabelRepository'

export type Label = LabelRecord

export interface CreateLabelParams {
  labelName: string
  labelColor: string
}

export interface UpdateLabelParams {
  labelId: string
  labelName?: string
  labelColor?: string
}

export interface DeleteLabelParams {
  labelId: string
}

export interface LinkLabelParams {
  issueId: string
  labelId: string
}

export interface ListIssueLabelParams {
  issueId: string
}
