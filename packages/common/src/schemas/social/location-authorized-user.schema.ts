/*
CPAL-1.0 License

The contents of this file are subject to the Common Public Attribution License
Version 1.0. (the "License"); you may not use this file except in compliance
with the License. You may obtain a copy of the License at
https://github.com/ir-engine/ir-engine/blob/dev/LICENSE.
The License is based on the Mozilla Public License Version 1.1, but Sections 14
and 15 have been added to cover use of software over a computer network and 
provide for limited attribution for the Original Developer. In addition, 
Exhibit A has been modified to be consistent with Exhibit B.

Software distributed under the License is distributed on an "AS IS" basis,
WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License for the
specific language governing rights and limitations under the License.

The Original Code is Infinite Reality Engine.

The Original Developer is the Initial Developer. The Initial Developer of the
Original Code is the Infinite Reality Engine team.

All portions of the code written by the Infinite Reality Engine team are Copyright © 2021-2023 
Infinite Reality Engine. All Rights Reserved.
*/

// For more information about this file see https://dove.feathersjs.com/guides/cli/service.schemas.html
import type { Static } from '@feathersjs/typebox'
import { getValidator, querySyntax, Type } from '@feathersjs/typebox'

import { TypedString } from '../../types/TypeboxUtils'
import { UserID } from '../user/user.schema'
import { dataValidator, queryValidator } from '../validators'
import { LocationID } from './location.schema'

export const locationAuthorizedUserPath = 'location-authorized-user'

export const locationAuthorizedUserMethods = ['find', 'create', 'patch', 'remove', 'get'] as const

// Main data model schema
export const locationAuthorizedUserSchema = Type.Object(
  {
    id: Type.String({
      format: 'uuid'
    }),
    locationId: TypedString<LocationID>({
      format: 'uuid'
    }),
    userId: TypedString<UserID>({
      format: 'uuid'
    }),
    createdAt: Type.String({ format: 'date-time' }),
    updatedAt: Type.String({ format: 'date-time' })
  },
  { $id: 'LocationAuthorizedUser', additionalProperties: false }
)
export interface LocationAuthorizedUserType extends Static<typeof locationAuthorizedUserSchema> {}

// Schema for creating new entries
export const locationAuthorizedUserDataSchema = Type.Pick(locationAuthorizedUserSchema, ['userId', 'locationId'], {
  $id: 'LocationAuthorizedUserData'
})
export interface LocationAuthorizedUserData extends Static<typeof locationAuthorizedUserDataSchema> {}

// Schema for updating existing entries
export const locationAuthorizedUserPatchSchema = Type.Partial(locationAuthorizedUserSchema, {
  $id: 'LocationAuthorizedUserPatch'
})
export interface LocationAuthorizedUserPatch extends Static<typeof locationAuthorizedUserPatchSchema> {}

// Schema for allowed query properties
export const locationAuthorizedUserQueryProperties = Type.Pick(locationAuthorizedUserSchema, [
  'id',
  'locationId',
  'userId'
])
export const locationAuthorizedUserQuerySchema = Type.Intersect(
  [
    querySyntax(locationAuthorizedUserQueryProperties),
    // Add additional query properties here
    Type.Object({}, { additionalProperties: false })
  ],
  { additionalProperties: false }
)

export interface LocationAuthorizedUserQuery extends Static<typeof locationAuthorizedUserQuerySchema> {}

export const locationAuthorizedUserValidator = /* @__PURE__ */ getValidator(locationAuthorizedUserSchema, dataValidator)
export const locationAuthorizedUserDataValidator = /* @__PURE__ */ getValidator(
  locationAuthorizedUserDataSchema,
  dataValidator
)
export const locationAuthorizedUserPatchValidator = /* @__PURE__ */ getValidator(
  locationAuthorizedUserPatchSchema,
  dataValidator
)
export const locationAuthorizedUserQueryValidator = /* @__PURE__ */ getValidator(
  locationAuthorizedUserQuerySchema,
  queryValidator
)
