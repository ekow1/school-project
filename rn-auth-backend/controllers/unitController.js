import Unit from '../models/Unit.js';
import Department from '../models/Department.js';
import Group from '../models/Group.js';
import mongoose from 'mongoose';

// Create Unit
export const createUnit = async (req, res) => {
    try {
        const { name, color, department, groups, shift } = req.body;

        if (!name || !department) {
            return res.status(400).json({ 
                success: false, 
                message: 'Unit name and department are required' 
            });
        }

        // Check if department is Operations - shift is required for Operations units
        const dept = await Department.findById(department);
        if (dept && dept.name && dept.name.toLowerCase() === 'operations' && !shift) {
            return res.status(400).json({
                success: false,
                message: 'Shift is required for Operations department units'
            });
        }

        // Validate and format groups with unit color
        let formattedGroups = [];
        if (groups && Array.isArray(groups) && groups.length > 0) {
            const unitColor = color || '#000000';
            for (const groupItem of groups) {
                let groupId;
                let groupColor = unitColor;
                
                // Handle both object format {groupId, color} and simple ID format
                if (typeof groupItem === 'object' && groupItem !== null) {
                    groupId = groupItem.groupId || groupItem._id;
                    // Use provided color or default to unit color
                    groupColor = groupItem.color || unitColor;
                } else {
                    groupId = groupItem;
                }
                
                if (!mongoose.Types.ObjectId.isValid(groupId)) {
                    return res.status(400).json({
                        success: false,
                        message: `Invalid group ID: ${groupId}`
                    });
                }
                const group = await Group.findById(groupId);
                if (!group) {
                    return res.status(404).json({
                        success: false,
                        message: `Group not found: ${groupId}`
                    });
                }
                formattedGroups.push({
                    groupId: groupId,
                    color: groupColor
                });
            }
        }

        const unit = new Unit({ name, color, department, groups: formattedGroups, shift });
        await unit.save();

        const populatedUnit = await Unit.findById(unit._id)
            .populate('department')
            .populate('groups.groupId');

        res.status(201).json({ 
            success: true, 
            message: 'Unit created successfully', 
            data: populatedUnit 
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ 
                success: false, 
                message: 'Unit name already exists for this department' 
            });
        }
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Get All Units
export const getAllUnits = async (req, res) => {
    try {
        const units = await Unit.find()
            .populate('department')
            .populate('groups.groupId')
            .sort({ name: 1 });
        
        res.status(200).json({ 
            success: true, 
            count: units.length, 
            data: units 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Get Unit By ID
export const getUnitById = async (req, res) => {
    try {
        const unit = await Unit.findById(req.params.id)
            .populate('department')
            .populate('groups.groupId')
            .populate('personnel');

        if (!unit) {
            return res.status(404).json({ 
                success: false, 
                message: 'Unit not found' 
            });
        }

        res.status(200).json({ 
            success: true, 
            data: unit 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Update Unit
export const updateUnit = async (req, res) => {
    try {
        const { name, color, department, groups, shift } = req.body;

        // Get current unit to check existing values
        const currentUnit = await Unit.findById(req.params.id);
        if (!currentUnit) {
            return res.status(404).json({
                success: false,
                message: 'Unit not found'
            });
        }

        // Validate shift for Operations department
        const deptId = department || currentUnit.department;
        const dept = await Department.findById(deptId);
        if (dept && dept.name && dept.name.toLowerCase() === 'operations') {
            const shiftValue = shift !== undefined ? shift : currentUnit.shift;
            if (!shiftValue) {
                return res.status(400).json({
                    success: false,
                    message: 'Shift is required for Operations department units'
                });
            }
        }

        // Validate and format groups with unit color when groups are provided
        const unitColor = color !== undefined ? color : currentUnit.color;
        let formattedGroups = undefined;
        
        if (groups && Array.isArray(groups)) {
            formattedGroups = [];
            for (const groupItem of groups) {
                let groupId;
                let groupColor = unitColor || '#000000';
                
                // Handle both object format {groupId, color} and simple ID format
                if (typeof groupItem === 'object' && groupItem !== null) {
                    groupId = groupItem.groupId || groupItem._id;
                    // Use provided color or default to unit color
                    groupColor = groupItem.color || unitColor;
                } else {
                    groupId = groupItem;
                }
                
                if (!mongoose.Types.ObjectId.isValid(groupId)) {
                    return res.status(400).json({
                        success: false,
                        message: `Invalid group ID: ${groupId}`
                    });
                }
                const group = await Group.findById(groupId);
                if (!group) {
                    return res.status(404).json({
                        success: false,
                        message: `Group not found: ${groupId}`
                    });
                }
                formattedGroups.push({
                    groupId: groupId,
                    color: groupColor
                });
            }
        } else if (color && currentUnit.groups && currentUnit.groups.length > 0) {
            // If color is updated but groups aren't, update existing groups' colors
            formattedGroups = currentUnit.groups.map(groupObj => ({
                groupId: groupObj.groupId || groupObj,
                color: unitColor
            }));
        }

        const updateData = { name, color, department, shift };
        if (formattedGroups !== undefined) {
            updateData.groups = formattedGroups;
        }

        const unit = await Unit.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        )
        .populate('department')
        .populate('groups.groupId');

        if (!unit) {
            return res.status(404).json({ 
                success: false, 
                message: 'Unit not found' 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: 'Unit updated successfully', 
            data: unit 
        });
    } catch (error) {
        if (error.code === 11000) {
            return res.status(400).json({ 
                success: false, 
                message: 'Unit name already exists for this department' 
            });
        }
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Delete Unit
export const deleteUnit = async (req, res) => {
    try {
        const unit = await Unit.findByIdAndDelete(req.params.id);

        if (!unit) {
            return res.status(404).json({ 
                success: false, 
                message: 'Unit not found' 
            });
        }

        res.status(200).json({ 
            success: true, 
            message: 'Unit deleted successfully' 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Get Units by Department
export const getUnitsByDepartment = async (req, res) => {
    try {
        const units = await Unit.find({ department: req.params.departmentId })
            .populate('department')
            .populate('groups.groupId')
            .sort({ name: 1 });
        
        res.status(200).json({ 
            success: true, 
            count: units.length, 
            data: units 
        });
    } catch (error) {
        res.status(500).json({ 
            success: false, 
            message: error.message 
        });
    }
};

// Activate Unit (set on duty)
export const activateUnit = async (req, res) => {
    try {
        const unitId = req.params.id;

        // Find the unit
        const unit = await Unit.findById(unitId)
            .populate('department')
            .populate('groups.groupId');
        
        if (!unit) {
            return res.status(404).json({
                success: false,
                message: 'Unit not found'
            });
        }

        // Check if unit belongs to Operations department
        if (!unit.department || unit.department.name.toLowerCase() !== 'operations') {
            return res.status(400).json({
                success: false,
                message: 'Only Operations department units can be activated'
            });
        }

        // Check if another unit in the same department is already active
        const activeUnit = await Unit.findOne({
            department: unit.department._id,
            isActive: true,
            _id: { $ne: unitId }
        });

        if (activeUnit) {
            return res.status(400).json({
                success: false,
                message: `Another unit (${activeUnit.name}) is already active in this department. Only one unit can be active at a time.`,
                activeUnit: {
                    id: activeUnit._id,
                    name: activeUnit.name
                }
            });
        }

        // Activate this unit
        unit.isActive = true;
        unit.activatedAt = new Date();
        await unit.save();

        // Populate after save
        await unit.populate('groups.groupId');

        res.status(200).json({
            success: true,
            message: 'Unit activated successfully',
            data: unit
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Deactivate Unit (set off duty)
export const deactivateUnit = async (req, res) => {
    try {
        const unitId = req.params.id;

        // Find the unit first to check activation time
        const unit = await Unit.findById(unitId)
            .populate('department')
            .populate('groups.groupId');

        if (!unit) {
            return res.status(404).json({
                success: false,
                message: 'Unit not found'
            });
        }

        // Check if unit was activated
        if (!unit.activatedAt) {
            // Unit wasn't activated, can deactivate anytime
            const updatedUnit = await Unit.findByIdAndUpdate(
                unitId,
                { isActive: false, activatedAt: null },
                { new: true, runValidators: true }
            )
            .populate('department')
            .populate('groups.groupId');

            return res.status(200).json({
                success: true,
                message: 'Unit deactivated successfully',
                data: updatedUnit
            });
        }

        // Check if it's after 7 AM the next day from activation
        const now = new Date();
        const activationDate = new Date(unit.activatedAt);
        
        // Calculate next day 7 AM from activation
        const nextDay7AM = new Date(activationDate);
        nextDay7AM.setDate(nextDay7AM.getDate() + 1);
        nextDay7AM.setHours(7, 0, 0, 0);

        if (now < nextDay7AM) {
            return res.status(400).json({
                success: false,
                message: `Unit can only be deactivated after 7 AM the next day. Next deactivation time: ${nextDay7AM.toLocaleString()}`,
                nextDeactivationTime: nextDay7AM,
                activatedAt: unit.activatedAt
            });
        }

        // It's after 7 AM the next day, allow deactivation
        const updatedUnit = await Unit.findByIdAndUpdate(
            unitId,
            { isActive: false, activatedAt: null },
            { new: true, runValidators: true }
        )
        .populate('department')
        .populate('groups.groupId');

        res.status(200).json({
            success: true,
            message: 'Unit deactivated successfully',
            data: updatedUnit
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Auto-deactivate units (called by scheduled task at 8 AM daily)
export const autoDeactivateUnits = async () => {
    try {
        console.log('🔄 Running automatic unit deactivation at 8 AM...');
        
        // Find all active units
        const activeUnits = await Unit.find({ isActive: true }).populate('department');

        const now = new Date();
        const deactivatedUnits = [];

        for (const unit of activeUnits) {
            if (!unit.activatedAt) {
                continue; // Skip units without activation time
            }

            // Calculate next day 8 AM from activation
            const activationDate = new Date(unit.activatedAt);
            const nextDay8AM = new Date(activationDate);
            nextDay8AM.setDate(nextDay8AM.getDate() + 1);
            nextDay8AM.setHours(8, 0, 0, 0);

            // If current time is >= 8 AM the next day, deactivate
            if (now >= nextDay8AM) {
                unit.isActive = false;
                unit.activatedAt = null;
                await unit.save();
                deactivatedUnits.push({
                    unitId: unit._id,
                    unitName: unit.name,
                    department: unit.department?.name,
                    activatedAt: activationDate
                });
                console.log(`✅ Auto-deactivated unit: ${unit.name} (ID: ${unit._id})`);
            }
        }

        if (deactivatedUnits.length > 0) {
            console.log(`✅ Automatically deactivated ${deactivatedUnits.length} unit(s)`);
        } else {
            console.log('ℹ️ No units needed automatic deactivation');
        }

        return {
            success: true,
            deactivatedCount: deactivatedUnits.length,
            deactivatedUnits
        };
    } catch (error) {
        console.error('❌ Error in auto-deactivation:', error);
        throw error;
    }
};

