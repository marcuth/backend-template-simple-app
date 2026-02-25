import { CanActivate, Inject, Injectable, Type } from "@nestjs/common"

import { ResourceService } from "../interfaces/resource-service.interface"
import { OwnershipGuard } from "../guards/ownership.guard"

export function OwnershipGuardFactory<T>(ownerIdProperty: string): Type<CanActivate> {
    @Injectable()
    class InternalOwnershipGuard extends OwnershipGuard<T> {
        constructor(@Inject("RESOURCE_SERVICE") resourceService: ResourceService<T>) {
            super(resourceService, ownerIdProperty)
        }
    }

    return InternalOwnershipGuard
}
