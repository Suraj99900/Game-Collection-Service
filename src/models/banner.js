
const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
    staff_id: { type: String, required: true },
    banner_name: { type: String, require: true },
    file: { type: String, require: true },
    status: { type: String, default: 'active' },
    deleted: { type: Boolean, default: false },
    addedOn: { type: Date, default: Date.now },
    updatedOn: { type: Date, default: null },
});

const BannerModal = mongoose.model('banner', bannerSchema);

const insertBannerData = async (staffId, bannerName, file) => {
    try {
        return await BannerModal.create({
            staff_id: staffId,
            banner_name: bannerName,
            file: file,
        });
    } catch (error) {
        console.error('Error inserting refer data:', error);
        throw error;
    }
}

const updateBannerData = async (id, oUpdateFields) => {
    try {
        const updatedDocument = await BannerModal.findOneAndUpdate(
            { _id: id },
            { $set: oUpdateFields },
            { new: true }
        );
        if (!updatedDocument) {
            throw new Error('Refer data not found');
        }
        return updatedDocument;
    } catch (error) {
        console.error('Error updating refer data:', error);
        throw error;
    }
}

const fetchAllBannerData = async () => {
    try {
        return await BannerModal.find({ deleted: false }).sort({addedOn:-1});
    } catch (error) {
        console.error('Error fetching all refer data:', error);
        throw error;
    }
}

const fetchBannerDataById = async (id) => {
    try {
        const bannerData = await BannerModal.findById(id);
        if (!bannerData || bannerData.deleted) {
            throw new Error('Refer data not found or has been deleted');
        }
        return referData;
    } catch (error) {
        console.error('Error fetching refer data by ID:', error);
        throw error;
    }
}

const deleteBannerData = async (id) => {
    try {
        const deletedDocument = await BannerModal.findByIdAndUpdate(
            id,
            { $set: { deleted: true, updatedOn: Date.now() } },
            { new: true }
        );
        if (!deletedDocument) {
            throw new Error('Refer data not found');
        }
        return deletedDocument;
    } catch (error) {
        console.error('Error deleting refer data:', error);
        throw error;
    }
}

const freezeBannerData = async (id) => {
    try {
        const frozenDocument = await ReferCode.findByIdAndUpdate(
            id,
            { $set: { status: "inactive", updatedOn: Date.now() } },
            { new: true }
        );
        if (!frozenDocument) {
            throw new Error('Refer data not found');
        }
        return frozenDocument;
    } catch (error) {
        console.error('Error freezing refer data:', error);
        throw error;
    }
}

module.exports = {
    insertBannerData,
    updateBannerData,
    fetchAllBannerData,
    fetchBannerDataById,
    deleteBannerData,
    freezeBannerData
};