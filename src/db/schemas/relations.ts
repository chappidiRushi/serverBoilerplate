import { relations } from "drizzle-orm/relations";
import { colorTable } from "./color.schema";
import { plantCategoryTable } from "./plant_category.shema";
import {
	compatiblePots,
	fertilizers,
	humidityLevel,
	plantCareGuidelines,
	plantFertilizerSchedule,
	plants,
	plantSizeProfile,
	plantVariantImage,
	plantVariants,
	plantVariantToTags,
	potCategory,
	potMaterial,
	potSizeProfile,
	potVariantImage,
	potVariants,
	potVariantToTags,
	productCategories,
	sizeMaterialOption,
	sunlightTypes,
	tagGroups, tags
} from "./schema";

export const sizeMaterialOptionRelations = relations(sizeMaterialOption, ({ one, many }) => ({
	potVariants: many(potVariants),
	potSizeProfile: one(potSizeProfile, {
		fields: [sizeMaterialOption.potSizeProfileId],
		references: [potSizeProfile.potSizeProfileId]
	}),
	potMaterial: one(potMaterial, {
		fields: [sizeMaterialOption.materialId],
		references: [potMaterial.materialId]
	}),
}));

export const potSizeProfileRelations = relations(potSizeProfile, ({ one, many }) => ({
	potCategory: one(potCategory, {
		fields: [potSizeProfile.categoryId],
		references: [potCategory.categoryId]
	}),
	sizeMaterialOptions: many(sizeMaterialOption),
}));

export const potMaterialRelations = relations(potMaterial, ({ many }) => ({
	sizeMaterialOptions: many(sizeMaterialOption),
}));

export const productCategoriesRelations = relations(productCategories, ({ one }) => ({
	plantCategoryTable: one(plantCategoryTable, {
		fields: [productCategories.a],
		references: [plantCategoryTable.id]
	}),
	plant: one(plants, {
		fields: [productCategories.b],
		references: [plants.plantId]
	}),
}));

export const plantCategoryTableRelations = relations(plantCategoryTable, ({ many }) => ({
	productCategories: many(productCategories),
}));

export const compatiblePotsRelations = relations(compatiblePots, ({ one }) => ({
	plantSizeProfile: one(plantSizeProfile, {
		fields: [compatiblePots.a],
		references: [plantSizeProfile.plantSizeId]
	}),
	potVariant: one(potVariants, {
		fields: [compatiblePots.b],
		references: [potVariants.potVariantId]
	}),
}));

export const plantVariantToTagsRelations = relations(plantVariantToTags, ({ one }) => ({
	plantVariant: one(plantVariants, {
		fields: [plantVariantToTags.a],
		references: [plantVariants.variantId]
	}),
	tag: one(tags, {
		fields: [plantVariantToTags.b],
		references: [tags.tagId]
	}),
}));

export const potVariantToTagsRelations = relations(potVariantToTags, ({ one }) => ({
	potVariant: one(potVariants, {
		fields: [potVariantToTags.a],
		references: [potVariants.potVariantId]
	}),
	tag: one(tags, {
		fields: [potVariantToTags.b],
		references: [tags.tagId]
	}),
}));

export const potVariantImageRelations = relations(potVariantImage, ({ one }) => ({
	potVariant: one(potVariants, {
		fields: [potVariantImage.potVariantId],
		references: [potVariants.potVariantId]
	}),
}));

export const plantVariantImageRelations = relations(plantVariantImage, ({ one }) => ({
	plantVariant: one(plantVariants, {
		fields: [plantVariantImage.plantVariantId],
		references: [plantVariants.variantId]
	}),
}));

export const plantCareGuidelinesRelations = relations(plantCareGuidelines, ({ one }) => ({
	plantSizeProfile: one(plantSizeProfile, {
		fields: [plantCareGuidelines.plantSizeId],
		references: [plantSizeProfile.plantSizeId]
	}),
	sunlightType: one(sunlightTypes, {
		fields: [plantCareGuidelines.sunlightTypeId],
		references: [sunlightTypes.sunlightId]
	}),
	humidityLevel: one(humidityLevel, {
		fields: [plantCareGuidelines.humidityLevelId],
		references: [humidityLevel.humidityId]
	}),
}));

export const sunlightTypesRelations = relations(sunlightTypes, ({ many }) => ({
	plantCareGuidelines: many(plantCareGuidelines),
}));

export const humidityLevelRelations = relations(humidityLevel, ({ many }) => ({
	plantCareGuidelines: many(plantCareGuidelines),
}));

export const plantFertilizerScheduleRelations = relations(plantFertilizerSchedule, ({ one }) => ({
	plantSizeProfile: one(plantSizeProfile, {
		fields: [plantFertilizerSchedule.plantSizeId],
		references: [plantSizeProfile.plantSizeId]
	}),
	fertilizer: one(fertilizers, {
		fields: [plantFertilizerSchedule.fertilizerId],
		references: [fertilizers.fertilizerId]
	}),
}));

export const fertilizersRelations = relations(fertilizers, ({ many }) => ({
	plantFertilizerSchedules: many(plantFertilizerSchedule),
}));

export const tagsRelations = relations(tags, ({ one, many }) => ({
	tagGroup: one(tagGroups, {
		fields: [tags.groupId],
		references: [tagGroups.groupId]
	}),
	plantVariantToTags: many(plantVariantToTags),
	potVariantToTags: many(potVariantToTags),
}));

export const tagGroupsRelations = relations(tagGroups, ({ many }) => ({
	tags: many(tags),
}));

// export const roleRelations = relations(role, ({one, many}) => ({
// 	user: one(user, {
// 		fields: [role.addedByUserId],
// 		references: [user.userId],
// 		relationName: "role_addedByUserId_user_userId"
// 	}),
// 	users: many(user, {
// 		relationName: "user_roleId_role_roleId"
// 	}),
// 	roleCreationAuditLogs: many(roleCreationAuditLog),
// 	rolePermissionAuditLogs: many(rolePermissionAuditLog),
// 	rolePermissions: many(rolePermission),
// 	groupRoles: many(groupRole),
// }));

// export const userRelations = relations(user, ({one, many}) => ({
// 	roles: many(role, {
// 		relationName: "role_addedByUserId_user_userId"
// 	}),
// 	role: one(role, {
// 		fields: [user.roleId],
// 		references: [role.roleId],
// 		relationName: "user_roleId_role_roleId"
// 	}),
// 	roleCreationAuditLogs: many(roleCreationAuditLog),
// 	actions: many(action),
// 	modules: many(module),
// 	resources: many(resource),
// 	permissions: many(permission),
// 	rolePermissionAuditLogs: many(rolePermissionAuditLog),
// 	userPermissionAuditLogs_userId: many(userPermissionAuditLog, {
// 		relationName: "userPermissionAuditLog_userId_user_userId"
// 	}),
// 	userPermissionAuditLogs_addedByUserId: many(userPermissionAuditLog, {
// 		relationName: "userPermissionAuditLog_addedByUserId_user_userId"
// 	}),
// 	groupPermissionAuditLogs: many(groupPermissionAuditLog),
// 	customers: many(customer),
// 	admins: many(admin),
// 	superAdmins: many(superAdmin),
// 	employees: many(employee),
// 	warehouseEmployees: many(warehouseEmployee),
// 	suppliers: many(supplier),
// 	emailVerifications: many(emailVerification),
// 	phoneVerifications: many(phoneVerification),
// 	notifications: many(notification),
// 	rolePermissions: many(rolePermission),
// 	userGroups: many(userGroup),
// 	userPermissions_userId: many(userPermission, {
// 		relationName: "userPermission_userId_user_userId"
// 	}),
// 	userPermissions_addedByUserId: many(userPermission, {
// 		relationName: "userPermission_addedByUserId_user_userId"
// 	}),
// }));

// export const roleCreationAuditLogRelations = relations(roleCreationAuditLog, ({one}) => ({
// 	role: one(role, {
// 		fields: [roleCreationAuditLog.roleId],
// 		references: [role.roleId]
// 	}),
// 	user: one(user, {
// 		fields: [roleCreationAuditLog.createdById],
// 		references: [user.userId]
// 	}),
// }));

// export const actionRelations = relations(action, ({one, many}) => ({
// 	user: one(user, {
// 		fields: [action.addedByUserId],
// 		references: [user.userId]
// 	}),
// 	permissions: many(permission),
// 	groupPermissions: many(groupPermission),
// 	groupPermissionAuditLogs: many(groupPermissionAuditLog),
// }));

// export const moduleRelations = relations(module, ({one, many}) => ({
// 	user: one(user, {
// 		fields: [module.addedByUserId],
// 		references: [user.userId]
// 	}),
// 	resources: many(resource),
// 	permissions: many(permission),
// 	groupPermissions: many(groupPermission),
// 	groupPermissionAuditLogs: many(groupPermissionAuditLog),
// }));

// export const resourceRelations = relations(resource, ({one, many}) => ({
// 	module: one(module, {
// 		fields: [resource.moduleId],
// 		references: [module.moduleId]
// 	}),
// 	user: one(user, {
// 		fields: [resource.addedByUserId],
// 		references: [user.userId]
// 	}),
// 	permissions: many(permission),
// 	groupPermissions: many(groupPermission),
// 	groupPermissionAuditLogs: many(groupPermissionAuditLog),
// }));

// export const permissionRelations = relations(permission, ({one, many}) => ({
// 	action: one(action, {
// 		fields: [permission.actionId],
// 		references: [action.actionId]
// 	}),
// 	resource: one(resource, {
// 		fields: [permission.resourceId],
// 		references: [resource.resourceId]
// 	}),
// 	module: one(module, {
// 		fields: [permission.moduleId],
// 		references: [module.moduleId]
// 	}),
// 	user: one(user, {
// 		fields: [permission.addedByUserId],
// 		references: [user.userId]
// 	}),
// 	rolePermissionAuditLogs: many(rolePermissionAuditLog),
// 	userPermissionAuditLogs: many(userPermissionAuditLog),
// 	rolePermissions: many(rolePermission),
// 	userPermissions: many(userPermission),
// }));

// export const rolePermissionAuditLogRelations = relations(rolePermissionAuditLog, ({one}) => ({
// 	role: one(role, {
// 		fields: [rolePermissionAuditLog.roleId],
// 		references: [role.roleId]
// 	}),
// 	permission: one(permission, {
// 		fields: [rolePermissionAuditLog.permissionId],
// 		references: [permission.permissionId]
// 	}),
// 	user: one(user, {
// 		fields: [rolePermissionAuditLog.addedByUserId],
// 		references: [user.userId]
// 	}),
// }));

// export const userPermissionAuditLogRelations = relations(userPermissionAuditLog, ({one}) => ({
// 	user_userId: one(user, {
// 		fields: [userPermissionAuditLog.userId],
// 		references: [user.userId],
// 		relationName: "userPermissionAuditLog_userId_user_userId"
// 	}),
// 	permission: one(permission, {
// 		fields: [userPermissionAuditLog.permissionId],
// 		references: [permission.permissionId]
// 	}),
// 	user_addedByUserId: one(user, {
// 		fields: [userPermissionAuditLog.addedByUserId],
// 		references: [user.userId],
// 		relationName: "userPermissionAuditLog_addedByUserId_user_userId"
// 	}),
// }));

// export const groupPermissionRelations = relations(groupPermission, ({one}) => ({
// 	group: one(group, {
// 		fields: [groupPermission.groupId],
// 		references: [group.groupId]
// 	}),
// 	action: one(action, {
// 		fields: [groupPermission.actionId],
// 		references: [action.actionId]
// 	}),
// 	resource: one(resource, {
// 		fields: [groupPermission.resourceId],
// 		references: [resource.resourceId]
// 	}),
// 	module: one(module, {
// 		fields: [groupPermission.moduleId],
// 		references: [module.moduleId]
// 	}),
// }));

// export const groupRelations = relations(group, ({many}) => ({
// 	groupPermissions: many(groupPermission),
// 	groupPermissionAuditLogs: many(groupPermissionAuditLog),
// 	userGroups: many(userGroup),
// 	groupRoles: many(groupRole),
// }));

// export const groupPermissionAuditLogRelations = relations(groupPermissionAuditLog, ({one}) => ({
// 	group: one(group, {
// 		fields: [groupPermissionAuditLog.groupId],
// 		references: [group.groupId]
// 	}),
// 	user: one(user, {
// 		fields: [groupPermissionAuditLog.addedByUserId],
// 		references: [user.userId]
// 	}),
// 	action: one(action, {
// 		fields: [groupPermissionAuditLog.actionId],
// 		references: [action.actionId]
// 	}),
// 	resource: one(resource, {
// 		fields: [groupPermissionAuditLog.resourceId],
// 		references: [resource.resourceId]
// 	}),
// 	module: one(module, {
// 		fields: [groupPermissionAuditLog.moduleId],
// 		references: [module.moduleId]
// 	}),
// }));

// export const customerRelations = relations(customer, ({one, many}) => ({
// 	user: one(user, {
// 		fields: [customer.userId],
// 		references: [user.userId]
// 	}),
// 	customerSessions: many(customerSessions),
// 	notifyMeSubscriptions: many(notifyMeSubscription),
// 	customerAddresses: many(customerAddress),
// 	plantCartItems: many(plantCartItem),
// 	potCartItems: many(potCartItem),
// 	plantCheckoutLaters: many(plantCheckoutLater),
// 	potCheckoutLaters: many(potCheckoutLater),
// 	orders: many(order),
// 	returnsRefunds: many(returnsRefunds),
// 	referralCodes: many(referralCode),
// 	referralUsages: many(referralUsage),
// 	reviews: many(review),
// 	websiteAnalytics: many(websiteAnalytics),
// }));

// export const adminRelations = relations(admin, ({one}) => ({
// 	user: one(user, {
// 		fields: [admin.userId],
// 		references: [user.userId]
// 	}),
// }));

// export const superAdminRelations = relations(superAdmin, ({one}) => ({
// 	user: one(user, {
// 		fields: [superAdmin.userId],
// 		references: [user.userId]
// 	}),
// }));

// export const employeeRelations = relations(employee, ({one, many}) => ({
// 	user: one(user, {
// 		fields: [employee.userId],
// 		references: [user.userId]
// 	}),
// 	warehouseEmployees: many(warehouseEmployee),
// }));

// export const warehouseEmployeeRelations = relations(warehouseEmployee, ({one}) => ({
// 	warehouse: one(warehouse, {
// 		fields: [warehouseEmployee.warehouseId],
// 		references: [warehouse.warehouseId]
// 	}),
// 	employee: one(employee, {
// 		fields: [warehouseEmployee.employeeId],
// 		references: [employee.employeeId]
// 	}),
// 	user: one(user, {
// 		fields: [warehouseEmployee.assignedByUserId],
// 		references: [user.userId]
// 	}),
// }));

// export const warehouseRelations = relations(warehouse, ({many}) => ({
// 	warehouseEmployees: many(warehouseEmployee),
// 	suppliers: many(supplier),
// 	plantStockAuditLogs: many(plantStockAuditLog),
// 	potStockAuditLogs: many(potStockAuditLog),
// 	plantDamagedProducts: many(plantDamagedProduct),
// 	purchaseOrders: many(purchaseOrder),
// 	potDamagedProducts: many(potDamagedProduct),
// 	plantWarehouseInventories: many(plantWarehouseInventory),
// 	potWarehouseInventories: many(potWarehouseInventory),
// 	plantRestockEventLogs: many(plantRestockEventLog),
// 	potRestockEventLogs: many(potRestockEventLog),
// 	warehouseCartItems: many(warehouseCartItem),
// }));

// export const supplierRelations = relations(supplier, ({one, many}) => ({
// 	user: one(user, {
// 		fields: [supplier.userId],
// 		references: [user.userId]
// 	}),
// 	warehouse: one(warehouse, {
// 		fields: [supplier.warehouseId],
// 		references: [warehouse.warehouseId]
// 	}),
// 	nurseryMediaAssets: many(nurseryMediaAsset),
// 	purchaseOrders: many(purchaseOrder),
// 	plantRestockEventLogs: many(plantRestockEventLog),
// 	potRestockEventLogs: many(potRestockEventLog),
// 	warehouseCartItems: many(warehouseCartItem),
// 	plantSupplierInventories: many(plantSupplierInventory),
// 	potSupplierInventories: many(potSupplierInventory),
// }));

// export const nurseryMediaAssetRelations = relations(nurseryMediaAsset, ({one}) => ({
// 	supplier: one(supplier, {
// 		fields: [nurseryMediaAsset.supplierId],
// 		references: [supplier.supplierId]
// 	}),
// }));

// export const customerSessionsRelations = relations(customerSessions, ({one}) => ({
// 	customer: one(customer, {
// 		fields: [customerSessions.customerId],
// 		references: [customer.customerId]
// 	}),
// }));

// export const notifyMeSubscriptionRelations = relations(notifyMeSubscription, ({one}) => ({
// 	customer: one(customer, {
// 		fields: [notifyMeSubscription.customerId],
// 		references: [customer.customerId]
// 	}),
// 	plant: one(plants, {
// 		fields: [notifyMeSubscription.plantId],
// 		references: [plants.plantId]
// 	}),
// 	plantVariant: one(plantVariants, {
// 		fields: [notifyMeSubscription.plantVariantId],
// 		references: [plantVariants.variantId]
// 	}),
// 	potCategory: one(potCategory, {
// 		fields: [notifyMeSubscription.potCategoryId],
// 		references: [potCategory.categoryId]
// 	}),
// 	potVariant: one(potVariants, {
// 		fields: [notifyMeSubscription.potVariantId],
// 		references: [potVariants.potVariantId]
// 	}),
// }));

export const plantsRelations = relations(plants, ({ many }) => ({
	// notifyMeSubscriptions: many(notifyMeSubscription),
	plantVariants: many(plantVariants),
	// plantCartItems: many(plantCartItem),
	// plantCheckoutLaters: many(plantCheckoutLater),
	plantSizeProfiles: many(plantSizeProfile),
	// plantOrderItems: many(plantOrderItem),
	// returnsRefunds_plantId: many(returnsRefunds, {
	// 	relationName: "returnsRefunds_plantId_plants_plantId"
	// }),
	// returnsRefunds_exchangeProductId: many(returnsRefunds, {
	// 	relationName: "returnsRefunds_exchangeProductId_plants_plantId"
	// }),
	// promotionProducts: many(promotionProduct),
	// plantStockAuditLogs: many(plantStockAuditLog),
	// plantDamagedProducts: many(plantDamagedProduct),
	// purchaseOrderItems: many(purchaseOrderItems),
	// reviews: many(review),
	// plantSalesAnalytics: many(plantSalesAnalytics),
	// plantWarehouseInventories: many(plantWarehouseInventory),
	// plantRestockEventLogs: many(plantRestockEventLog),
	// warehouseCartItems: many(warehouseCartItem),
	// plantSupplierInventories: many(plantSupplierInventory),
	productCategories: many(productCategories),
}));

export const plantVariantsRelations = relations(plantVariants, ({ one, many }) => ({
	// notifyMeSubscriptions: many(notifyMeSubscription),
	plant: one(plants, {
		fields: [plantVariants.plantId],
		references: [plants.plantId]
	}),
	color: one(colorTable, {
		fields: [plantVariants.colorId],
		references: [colorTable.id]
	}),
	plantSizeProfile: one(plantSizeProfile, {
		fields: [plantVariants.plantSizeId],
		references: [plantSizeProfile.plantSizeId]
	}),
	// plantCartItems: many(plantCartItem),
	// plantCheckoutLaters: many(plantCheckoutLater),
	// plantVariantImages: many(plantVariantImage),
	// plantOrderItems: many(plantOrderItem),
	// promotionProducts: many(promotionProduct),
	// plantStockAuditLogs: many(plantStockAuditLog),
	// plantDamagedProducts: many(plantDamagedProduct),
	// purchaseOrderItems: many(purchaseOrderItems),
	// reviews: many(review),
	// plantSalesAnalytics: many(plantSalesAnalytics),
	// plantWarehouseInventories: many(plantWarehouseInventory),
	// plantRestockEventLogs: many(plantRestockEventLog),
	// warehouseCartItems: many(warehouseCartItem),
	// plantSupplierInventories: many(plantSupplierInventory),
	plantVariantToTags: many(plantVariantToTags),
}));

export const potCategoryRelations = relations(potCategory, ({ many }) => ({
	// notifyMeSubscriptions: many(notifyMeSubscription),
	// potCartItems: many(potCartItem),
	// potCheckoutLaters: many(potCheckoutLater),
	// potOrderItems: many(potOrderItem),
	// promotionProducts: many(promotionProduct),
	// potStockAuditLogs: many(potStockAuditLog),
	// purchaseOrderItems: many(purchaseOrderItems),
	// potDamagedProducts: many(potDamagedProduct),
	// reviews: many(review),
	// potSalesAnalytics: many(potSalesAnalytics),
	// potWarehouseInventories: many(potWarehouseInventory),
	// potRestockEventLogs: many(potRestockEventLog),
	// warehouseCartItems: many(warehouseCartItem),
	// potSupplierInventories: many(potSupplierInventory),
	potSizeProfiles: many(potSizeProfile),
}));

export const potVariantsRelations = relations(potVariants, ({ one, many }) => ({
	// notifyMeSubscriptions: many(notifyMeSubscription),
	// potCartItems: many(potCartItem),
	// potCheckoutLaters: many(potCheckoutLater),
	potVariantImages: many(potVariantImage),
	// potOrderItems: many(potOrderItem),
	// promotionProducts: many(promotionProduct),
	// potStockAuditLogs: many(potStockAuditLog),
	// purchaseOrderItems: many(purchaseOrderItems),
	// potDamagedProducts: many(potDamagedProduct),
	// reviews: many(review),
	// potSalesAnalytics: many(potSalesAnalytics),
	// potWarehouseInventories: many(potWarehouseInventory),
	// potRestockEventLogs: many(potRestockEventLog),
	// warehouseCartItems: many(warehouseCartItem),
	// potSupplierInventories: many(potSupplierInventory),
	color: one(colorTable, {
		fields: [potVariants.colorId],
		references: [colorTable.id]
	}),
	sizeMaterialOption: one(sizeMaterialOption, {
		fields: [potVariants.sizeMaterialOptionId],
		references: [sizeMaterialOption.sizeMaterialOptionId]
	}),
	compatiblePots: many(compatiblePots),
	potVariantToTags: many(potVariantToTags),
}));

export const colorRelations = relations(colorTable, ({ many }) => ({
	plantVariants: many(plantVariants),
	potVariants: many(potVariants),
}));

export const plantSizeProfileRelations = relations(plantSizeProfile, ({ one, many }) => ({
	plantVariants: many(plantVariants),
	plant: one(plants, {
		fields: [plantSizeProfile.plantId],
		references: [plants.plantId]
	}),
	plantCareGuidelines: many(plantCareGuidelines),
	plantFertilizerSchedules: many(plantFertilizerSchedule),
	compatiblePots: many(compatiblePots),
}));

// export const customerAddressRelations = relations(customerAddress, ({one, many}) => ({
// 	customer: one(customer, {
// 		fields: [customerAddress.customerId],
// 		references: [customer.customerId]
// 	}),
// 	shippings: many(shipping),
// }));

// export const plantCartItemRelations = relations(plantCartItem, ({one}) => ({
// 	customer: one(customer, {
// 		fields: [plantCartItem.customerId],
// 		references: [customer.customerId]
// 	}),
// 	plant: one(plants, {
// 		fields: [plantCartItem.plantId],
// 		references: [plants.plantId]
// 	}),
// 	plantVariant: one(plantVariants, {
// 		fields: [plantCartItem.plantVariantId],
// 		references: [plantVariants.variantId]
// 	}),
// 	promoCode: one(promoCode, {
// 		fields: [plantCartItem.couponId],
// 		references: [promoCode.promoCodeId]
// 	}),
// }));

// export const promoCodeRelations = relations(promoCode, ({many}) => ({
// 	plantCartItems: many(plantCartItem),
// 	potCartItems: many(potCartItem),
// 	plantCheckoutLaters: many(plantCheckoutLater),
// 	potCheckoutLaters: many(potCheckoutLater),
// 	orders: many(order),
// 	plantOrderItems: many(plantOrderItem),
// 	potOrderItems: many(potOrderItem),
// }));

// export const potCartItemRelations = relations(potCartItem, ({one}) => ({
// 	customer: one(customer, {
// 		fields: [potCartItem.customerId],
// 		references: [customer.customerId]
// 	}),
// 	potCategory: one(potCategory, {
// 		fields: [potCartItem.potCategoryId],
// 		references: [potCategory.categoryId]
// 	}),
// 	potVariant: one(potVariants, {
// 		fields: [potCartItem.potVariantId],
// 		references: [potVariants.potVariantId]
// 	}),
// 	promoCode: one(promoCode, {
// 		fields: [potCartItem.couponId],
// 		references: [promoCode.promoCodeId]
// 	}),
// }));

// export const plantCheckoutLaterRelations = relations(plantCheckoutLater, ({one}) => ({
// 	customer: one(customer, {
// 		fields: [plantCheckoutLater.customerId],
// 		references: [customer.customerId]
// 	}),
// 	plant: one(plants, {
// 		fields: [plantCheckoutLater.plantId],
// 		references: [plants.plantId]
// 	}),
// 	plantVariant: one(plantVariants, {
// 		fields: [plantCheckoutLater.plantVariantId],
// 		references: [plantVariants.variantId]
// 	}),
// 	promoCode: one(promoCode, {
// 		fields: [plantCheckoutLater.promoCodeId],
// 		references: [promoCode.promoCodeId]
// 	}),
// }));

// export const potCheckoutLaterRelations = relations(potCheckoutLater, ({one}) => ({
// 	customer: one(customer, {
// 		fields: [potCheckoutLater.customerId],
// 		references: [customer.customerId]
// 	}),
// 	potCategory: one(potCategory, {
// 		fields: [potCheckoutLater.potCategoryId],
// 		references: [potCategory.categoryId]
// 	}),
// 	potVariant: one(potVariants, {
// 		fields: [potCheckoutLater.potVariantId],
// 		references: [potVariants.potVariantId]
// 	}),
// 	promoCode: one(promoCode, {
// 		fields: [potCheckoutLater.promoCodeId],
// 		references: [promoCode.promoCodeId]
// 	}),
// }));

// export const plantSizeCostComponentRelations = relations(plantSizeCostComponent, ({one}) => ({
// 	plantGenericCostComponent: one(plantGenericCostComponent, {
// 		fields: [plantSizeCostComponent.genericCostComponentId],
// 		references: [plantGenericCostComponent.componentId]
// 	}),
// }));

// export const plantGenericCostComponentRelations = relations(plantGenericCostComponent, ({many}) => ({
// 	plantSizeCostComponents: many(plantSizeCostComponent),
// }));

// export const potSizeCostComponentRelations = relations(potSizeCostComponent, ({one}) => ({
// 	potGenericCostComponent: one(potGenericCostComponent, {
// 		fields: [potSizeCostComponent.genericCostComponentId],
// 		references: [potGenericCostComponent.componentId]
// 	}),
// }));

// export const potGenericCostComponentRelations = relations(potGenericCostComponent, ({many}) => ({
// 	potSizeCostComponents: many(potSizeCostComponent),
// }));

// export const orderRelations = relations(order, ({one, many}) => ({
// 	customer: one(customer, {
// 		fields: [order.customerId],
// 		references: [customer.customerId]
// 	}),
// 	promoCode: one(promoCode, {
// 		fields: [order.promoCodeId],
// 		references: [promoCode.promoCodeId]
// 	}),
// 	plantOrderItems: many(plantOrderItem),
// 	potOrderItems: many(potOrderItem),
// 	payments: many(payment),
// 	orderCostDetails: many(orderCostDetails),
// 	shippings: many(shipping),
// 	returnsRefunds: many(returnsRefunds),
// 	plantDamagedProducts: many(plantDamagedProduct),
// 	potDamagedProducts: many(potDamagedProduct),
// }));

// export const plantOrderItemRelations = relations(plantOrderItem, ({one, many}) => ({
// 	plant: one(plants, {
// 		fields: [plantOrderItem.plantId],
// 		references: [plants.plantId]
// 	}),
// 	plantVariant: one(plantVariants, {
// 		fields: [plantOrderItem.plantVariantId],
// 		references: [plantVariants.variantId]
// 	}),
// 	order: one(order, {
// 		fields: [plantOrderItem.orderId],
// 		references: [order.orderId]
// 	}),
// 	promoCode: one(promoCode, {
// 		fields: [plantOrderItem.promoCodeId],
// 		references: [promoCode.promoCodeId]
// 	}),
// 	plantDamagedProducts: many(plantDamagedProduct),
// }));

// export const potOrderItemRelations = relations(potOrderItem, ({one, many}) => ({
// 	potCategory: one(potCategory, {
// 		fields: [potOrderItem.potCategoryId],
// 		references: [potCategory.categoryId]
// 	}),
// 	potVariant: one(potVariants, {
// 		fields: [potOrderItem.potVariantId],
// 		references: [potVariants.potVariantId]
// 	}),
// 	order: one(order, {
// 		fields: [potOrderItem.orderId],
// 		references: [order.orderId]
// 	}),
// 	promoCode: one(promoCode, {
// 		fields: [potOrderItem.promoCodeId],
// 		references: [promoCode.promoCodeId]
// 	}),
// 	potDamagedProducts: many(potDamagedProduct),
// }));

// export const paymentRelations = relations(payment, ({one}) => ({
// 	order: one(order, {
// 		fields: [payment.orderId],
// 		references: [order.orderId]
// 	}),
// }));

// export const orderCostDetailsRelations = relations(orderCostDetails, ({one}) => ({
// 	order: one(order, {
// 		fields: [orderCostDetails.orderId],
// 		references: [order.orderId]
// 	}),
// }));

// export const shippingRelations = relations(shipping, ({one, many}) => ({
// 	customerAddress: one(customerAddress, {
// 		fields: [shipping.addressId],
// 		references: [customerAddress.addressId]
// 	}),
// 	order: one(order, {
// 		fields: [shipping.orderId],
// 		references: [order.orderId]
// 	}),
// 	returnsRefunds: many(returnsRefunds),
// }));

// export const returnsRefundsRelations = relations(returnsRefunds, ({one}) => ({
// 	plant_plantId: one(plants, {
// 		fields: [returnsRefunds.plantId],
// 		references: [plants.plantId],
// 		relationName: "returnsRefunds_plantId_plants_plantId"
// 	}),
// 	plant_exchangeProductId: one(plants, {
// 		fields: [returnsRefunds.exchangeProductId],
// 		references: [plants.plantId],
// 		relationName: "returnsRefunds_exchangeProductId_plants_plantId"
// 	}),
// 	order: one(order, {
// 		fields: [returnsRefunds.orderId],
// 		references: [order.orderId]
// 	}),
// 	customer: one(customer, {
// 		fields: [returnsRefunds.customerId],
// 		references: [customer.customerId]
// 	}),
// 	shipping: one(shipping, {
// 		fields: [returnsRefunds.exchangeShippingId],
// 		references: [shipping.shippingId]
// 	}),
// }));

// export const promotionProductRelations = relations(promotionProduct, ({one}) => ({
// 	promotion: one(promotion, {
// 		fields: [promotionProduct.promoId],
// 		references: [promotion.promoId]
// 	}),
// 	plant: one(plants, {
// 		fields: [promotionProduct.plantId],
// 		references: [plants.plantId]
// 	}),
// 	plantVariant: one(plantVariants, {
// 		fields: [promotionProduct.plantVariantId],
// 		references: [plantVariants.variantId]
// 	}),
// 	potCategory: one(potCategory, {
// 		fields: [promotionProduct.potCategoryId],
// 		references: [potCategory.categoryId]
// 	}),
// 	potVariant: one(potVariants, {
// 		fields: [promotionProduct.potVariantId],
// 		references: [potVariants.potVariantId]
// 	}),
// }));

// export const promotionRelations = relations(promotion, ({many}) => ({
// 	promotionProducts: many(promotionProduct),
// }));

// export const referralCodeRelations = relations(referralCode, ({one, many}) => ({
// 	customer: one(customer, {
// 		fields: [referralCode.referrerCustomerId],
// 		references: [customer.customerId]
// 	}),
// 	referralUsages: many(referralUsage),
// }));

// export const referralUsageRelations = relations(referralUsage, ({one}) => ({
// 	referralCode: one(referralCode, {
// 		fields: [referralUsage.referralId],
// 		references: [referralCode.referralId]
// 	}),
// 	customer: one(customer, {
// 		fields: [referralUsage.referredCustomerId],
// 		references: [customer.customerId]
// 	}),
// }));

// export const plantStockAuditLogRelations = relations(plantStockAuditLog, ({one}) => ({
// 	plant: one(plants, {
// 		fields: [plantStockAuditLog.plantId],
// 		references: [plants.plantId]
// 	}),
// 	plantVariant: one(plantVariants, {
// 		fields: [plantStockAuditLog.plantVariantId],
// 		references: [plantVariants.variantId]
// 	}),
// 	warehouse: one(warehouse, {
// 		fields: [plantStockAuditLog.warehouseId],
// 		references: [warehouse.warehouseId]
// 	}),
// }));

// export const potStockAuditLogRelations = relations(potStockAuditLog, ({one}) => ({
// 	potCategory: one(potCategory, {
// 		fields: [potStockAuditLog.potCategoryId],
// 		references: [potCategory.categoryId]
// 	}),
// 	potVariant: one(potVariants, {
// 		fields: [potStockAuditLog.potVariantId],
// 		references: [potVariants.potVariantId]
// 	}),
// 	warehouse: one(warehouse, {
// 		fields: [potStockAuditLog.warehouseId],
// 		references: [warehouse.warehouseId]
// 	}),
// }));

// export const plantDamagedProductRelations = relations(plantDamagedProduct, ({one}) => ({
// 	plant: one(plants, {
// 		fields: [plantDamagedProduct.plantId],
// 		references: [plants.plantId]
// 	}),
// 	plantVariant: one(plantVariants, {
// 		fields: [plantDamagedProduct.plantVariantId],
// 		references: [plantVariants.variantId]
// 	}),
// 	warehouse: one(warehouse, {
// 		fields: [plantDamagedProduct.warehouseId],
// 		references: [warehouse.warehouseId]
// 	}),
// 	purchaseOrder: one(purchaseOrder, {
// 		fields: [plantDamagedProduct.purchaseOrderId],
// 		references: [purchaseOrder.id]
// 	}),
// 	purchaseOrderItem: one(purchaseOrderItems, {
// 		fields: [plantDamagedProduct.purchaseOrderItemId],
// 		references: [purchaseOrderItems.id]
// 	}),
// 	order: one(order, {
// 		fields: [plantDamagedProduct.orderId],
// 		references: [order.orderId]
// 	}),
// 	plantOrderItem: one(plantOrderItem, {
// 		fields: [plantDamagedProduct.plantOrderItemId],
// 		references: [plantOrderItem.orderItemId]
// 	}),
// }));

// export const purchaseOrderRelations = relations(purchaseOrder, ({one, many}) => ({
// 	plantDamagedProducts: many(plantDamagedProduct),
// 	supplier: one(supplier, {
// 		fields: [purchaseOrder.supplierId],
// 		references: [supplier.supplierId]
// 	}),
// 	warehouse: one(warehouse, {
// 		fields: [purchaseOrder.warehouseId],
// 		references: [warehouse.warehouseId]
// 	}),
// 	purchaseOrderItems: many(purchaseOrderItems),
// 	potDamagedProducts: many(potDamagedProduct),
// 	plantRestockEventLogs: many(plantRestockEventLog),
// 	potRestockEventLogs: many(potRestockEventLog),
// 	purchaseOrderPayments: many(purchaseOrderPayment),
// 	purchaseOrderMedias: many(purchaseOrderMedia),
// }));

// export const purchaseOrderItemsRelations = relations(purchaseOrderItems, ({one, many}) => ({
// 	plantDamagedProducts: many(plantDamagedProduct),
// 	purchaseOrder: one(purchaseOrder, {
// 		fields: [purchaseOrderItems.purchaseOrderId],
// 		references: [purchaseOrder.id]
// 	}),
// 	plant: one(plants, {
// 		fields: [purchaseOrderItems.plantId],
// 		references: [plants.plantId]
// 	}),
// 	plantVariant: one(plantVariants, {
// 		fields: [purchaseOrderItems.plantVariantId],
// 		references: [plantVariants.variantId]
// 	}),
// 	potCategory: one(potCategory, {
// 		fields: [purchaseOrderItems.potCategoryId],
// 		references: [potCategory.categoryId]
// 	}),
// 	potVariant: one(potVariants, {
// 		fields: [purchaseOrderItems.potVariantId],
// 		references: [potVariants.potVariantId]
// 	}),
// 	potDamagedProducts: many(potDamagedProduct),
// }));

// export const potDamagedProductRelations = relations(potDamagedProduct, ({one}) => ({
// 	potCategory: one(potCategory, {
// 		fields: [potDamagedProduct.potCategoryId],
// 		references: [potCategory.categoryId]
// 	}),
// 	potVariant: one(potVariants, {
// 		fields: [potDamagedProduct.potVariantId],
// 		references: [potVariants.potVariantId]
// 	}),
// 	warehouse: one(warehouse, {
// 		fields: [potDamagedProduct.warehouseId],
// 		references: [warehouse.warehouseId]
// 	}),
// 	purchaseOrder: one(purchaseOrder, {
// 		fields: [potDamagedProduct.purchaseOrderId],
// 		references: [purchaseOrder.id]
// 	}),
// 	purchaseOrderItem: one(purchaseOrderItems, {
// 		fields: [potDamagedProduct.purchaseOrderItemId],
// 		references: [purchaseOrderItems.id]
// 	}),
// 	order: one(order, {
// 		fields: [potDamagedProduct.orderId],
// 		references: [order.orderId]
// 	}),
// 	potOrderItem: one(potOrderItem, {
// 		fields: [potDamagedProduct.potOrderItemId],
// 		references: [potOrderItem.orderItemId]
// 	}),
// }));

// export const reviewRelations = relations(review, ({one, many}) => ({
// 	customer: one(customer, {
// 		fields: [review.customerId],
// 		references: [customer.customerId]
// 	}),
// 	plant: one(plants, {
// 		fields: [review.plantId],
// 		references: [plants.plantId]
// 	}),
// 	plantVariant: one(plantVariants, {
// 		fields: [review.plantVariantId],
// 		references: [plantVariants.variantId]
// 	}),
// 	potCategory: one(potCategory, {
// 		fields: [review.potCategoryId],
// 		references: [potCategory.categoryId]
// 	}),
// 	potVariant: one(potVariants, {
// 		fields: [review.potVariantId],
// 		references: [potVariants.potVariantId]
// 	}),
// 	reviewImages: many(reviewImage),
// }));

// export const reviewImageRelations = relations(reviewImage, ({one}) => ({
// 	review: one(review, {
// 		fields: [reviewImage.reviewId],
// 		references: [review.reviewId]
// 	}),
// }));

// export const websiteAnalyticsRelations = relations(websiteAnalytics, ({one}) => ({
// 	customer: one(customer, {
// 		fields: [websiteAnalytics.customerId],
// 		references: [customer.customerId]
// 	}),
// }));

// export const plantSalesAnalyticsRelations = relations(plantSalesAnalytics, ({one}) => ({
// 	plant: one(plants, {
// 		fields: [plantSalesAnalytics.plantId],
// 		references: [plants.plantId]
// 	}),
// 	plantVariant: one(plantVariants, {
// 		fields: [plantSalesAnalytics.plantVariantId],
// 		references: [plantVariants.variantId]
// 	}),
// }));

// export const potSalesAnalyticsRelations = relations(potSalesAnalytics, ({one}) => ({
// 	potCategory: one(potCategory, {
// 		fields: [potSalesAnalytics.potCategoryId],
// 		references: [potCategory.categoryId]
// 	}),
// 	potVariant: one(potVariants, {
// 		fields: [potSalesAnalytics.potVariantId],
// 		references: [potVariants.potVariantId]
// 	}),
// }));

// export const plantWarehouseInventoryRelations = relations(plantWarehouseInventory, ({one}) => ({
// 	plant: one(plants, {
// 		fields: [plantWarehouseInventory.plantId],
// 		references: [plants.plantId]
// 	}),
// 	warehouse: one(warehouse, {
// 		fields: [plantWarehouseInventory.warehouseId],
// 		references: [warehouse.warehouseId]
// 	}),
// 	plantVariant: one(plantVariants, {
// 		fields: [plantWarehouseInventory.variantId],
// 		references: [plantVariants.variantId]
// 	}),
// }));

// export const potWarehouseInventoryRelations = relations(potWarehouseInventory, ({one}) => ({
// 	potVariant: one(potVariants, {
// 		fields: [potWarehouseInventory.potVariantId],
// 		references: [potVariants.potVariantId]
// 	}),
// 	potCategory: one(potCategory, {
// 		fields: [potWarehouseInventory.potCategoryId],
// 		references: [potCategory.categoryId]
// 	}),
// 	warehouse: one(warehouse, {
// 		fields: [potWarehouseInventory.warehouseId],
// 		references: [warehouse.warehouseId]
// 	}),
// }));

// export const plantRestockEventLogRelations = relations(plantRestockEventLog, ({one}) => ({
// 	plant: one(plants, {
// 		fields: [plantRestockEventLog.plantId],
// 		references: [plants.plantId]
// 	}),
// 	plantVariant: one(plantVariants, {
// 		fields: [plantRestockEventLog.plantVariantId],
// 		references: [plantVariants.variantId]
// 	}),
// 	supplier: one(supplier, {
// 		fields: [plantRestockEventLog.supplierId],
// 		references: [supplier.supplierId]
// 	}),
// 	warehouse: one(warehouse, {
// 		fields: [plantRestockEventLog.warehouseId],
// 		references: [warehouse.warehouseId]
// 	}),
// 	purchaseOrder: one(purchaseOrder, {
// 		fields: [plantRestockEventLog.purchaseOrderId],
// 		references: [purchaseOrder.id]
// 	}),
// }));

// export const potRestockEventLogRelations = relations(potRestockEventLog, ({one}) => ({
// 	potVariant: one(potVariants, {
// 		fields: [potRestockEventLog.potVariantId],
// 		references: [potVariants.potVariantId]
// 	}),
// 	potCategory: one(potCategory, {
// 		fields: [potRestockEventLog.potCategoryId],
// 		references: [potCategory.categoryId]
// 	}),
// 	supplier: one(supplier, {
// 		fields: [potRestockEventLog.supplierId],
// 		references: [supplier.supplierId]
// 	}),
// 	warehouse: one(warehouse, {
// 		fields: [potRestockEventLog.warehouseId],
// 		references: [warehouse.warehouseId]
// 	}),
// 	purchaseOrder: one(purchaseOrder, {
// 		fields: [potRestockEventLog.purchaseOrderId],
// 		references: [purchaseOrder.id]
// 	}),
// }));

// export const warehouseCartItemRelations = relations(warehouseCartItem, ({one}) => ({
// 	warehouse: one(warehouse, {
// 		fields: [warehouseCartItem.warehouseId],
// 		references: [warehouse.warehouseId]
// 	}),
// 	supplier: one(supplier, {
// 		fields: [warehouseCartItem.supplierId],
// 		references: [supplier.supplierId]
// 	}),
// 	plant: one(plants, {
// 		fields: [warehouseCartItem.plantId],
// 		references: [plants.plantId]
// 	}),
// 	plantVariant: one(plantVariants, {
// 		fields: [warehouseCartItem.plantVariantId],
// 		references: [plantVariants.variantId]
// 	}),
// 	potCategory: one(potCategory, {
// 		fields: [warehouseCartItem.potCategoryId],
// 		references: [potCategory.categoryId]
// 	}),
// 	potVariant: one(potVariants, {
// 		fields: [warehouseCartItem.potVariantId],
// 		references: [potVariants.potVariantId]
// 	}),
// }));

// export const purchaseOrderPaymentRelations = relations(purchaseOrderPayment, ({one}) => ({
// 	purchaseOrder: one(purchaseOrder, {
// 		fields: [purchaseOrderPayment.orderId],
// 		references: [purchaseOrder.id]
// 	}),
// }));

// export const purchaseOrderMediaRelations = relations(purchaseOrderMedia, ({one}) => ({
// 	purchaseOrder: one(purchaseOrder, {
// 		fields: [purchaseOrderMedia.purchaseOrderId],
// 		references: [purchaseOrder.id]
// 	}),
// }));

// export const plantSupplierInventoryRelations = relations(plantSupplierInventory, ({one}) => ({
// 	supplier: one(supplier, {
// 		fields: [plantSupplierInventory.supplierId],
// 		references: [supplier.supplierId]
// 	}),
// 	plant: one(plants, {
// 		fields: [plantSupplierInventory.plantId],
// 		references: [plants.plantId]
// 	}),
// 	plantVariant: one(plantVariants, {
// 		fields: [plantSupplierInventory.plantVariantId],
// 		references: [plantVariants.variantId]
// 	}),
// }));

// export const potSupplierInventoryRelations = relations(potSupplierInventory, ({one}) => ({
// 	supplier: one(supplier, {
// 		fields: [potSupplierInventory.supplierId],
// 		references: [supplier.supplierId]
// 	}),
// 	potCategory: one(potCategory, {
// 		fields: [potSupplierInventory.potCategoryId],
// 		references: [potCategory.categoryId]
// 	}),
// 	potVariant: one(potVariants, {
// 		fields: [potSupplierInventory.potVariantId],
// 		references: [potVariants.potVariantId]
// 	}),
// }));

// export const emailVerificationRelations = relations(emailVerification, ({one}) => ({
// 	user: one(user, {
// 		fields: [emailVerification.userId],
// 		references: [user.userId]
// 	}),
// }));

// export const phoneVerificationRelations = relations(phoneVerification, ({one}) => ({
// 	user: one(user, {
// 		fields: [phoneVerification.userId],
// 		references: [user.userId]
// 	}),
// }));

// export const notificationRelations = relations(notification, ({one}) => ({
// 	user: one(user, {
// 		fields: [notification.userId],
// 		references: [user.userId]
// 	}),
// }));

// export const rolePermissionRelations = relations(rolePermission, ({one}) => ({
// 	role: one(role, {
// 		fields: [rolePermission.roleId],
// 		references: [role.roleId]
// 	}),
// 	permission: one(permission, {
// 		fields: [rolePermission.permissionId],
// 		references: [permission.permissionId]
// 	}),
// 	user: one(user, {
// 		fields: [rolePermission.addedByUserId],
// 		references: [user.userId]
// 	}),
// }));

// export const userGroupRelations = relations(userGroup, ({one}) => ({
// 	user: one(user, {
// 		fields: [userGroup.userId],
// 		references: [user.userId]
// 	}),
// 	group: one(group, {
// 		fields: [userGroup.groupId],
// 		references: [group.groupId]
// 	}),
// }));

// export const groupRoleRelations = relations(groupRole, ({one}) => ({
// 	group: one(group, {
// 		fields: [groupRole.groupId],
// 		references: [group.groupId]
// 	}),
// 	role: one(role, {
// 		fields: [groupRole.roleId],
// 		references: [role.roleId]
// 	}),
// }));

// export const userPermissionRelations = relations(userPermission, ({one}) => ({
// 	user_userId: one(user, {
// 		fields: [userPermission.userId],
// 		references: [user.userId],
// 		relationName: "userPermission_userId_user_userId"
// 	}),
// 	permission: one(permission, {
// 		fields: [userPermission.permissionId],
// 		references: [permission.permissionId]
// 	}),
// 	user_addedByUserId: one(user, {
// 		fields: [userPermission.addedByUserId],
// 		references: [user.userId],
// 		relationName: "userPermission_addedByUserId_user_userId"
// 	}),
// }));