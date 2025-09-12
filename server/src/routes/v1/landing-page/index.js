const express = require('express');
const landingPageController = require('~/controllers/landing.page.controller');
const landingPageValidation = require('~/validations/landing.page.validation');
// Import middlewares nếu cần thiết
// const { authMiddlewares } = require('~/middlewares/authMiddlewares');
// const { rbacMiddlewares } = require('~/middlewares/rbacMiddlewares');

const router = express.Router();

// GET: Lấy thông tin landing page hiện tại
router.route('/')
    .get(landingPageController.getLandingPage)
    .post(
        landingPageValidation.validateCreateLandingPage,
        landingPageController.createLandingPage
    )
    .put(
        landingPageValidation.validateUpdateLandingPage,
        landingPageController.updateLandingPage
    )
    .delete(landingPageController.deleteLandingPage);


router.route('/header')
    .patch(
        landingPageValidation.validateUpdateHeader,
        landingPageController.updateHeader
    );

router.route('/about')
    .patch(
        landingPageValidation.validateUpdateAboutSection,
        landingPageController.updateAboutSection
    );

router.route('/video')
    .patch(
        landingPageValidation.validateUpdateVideo,
        landingPageController.updateVideo
    );

router.route('/main-section')
    .patch(
        landingPageValidation.validateUpdateMainSection,
        landingPageController.updateMainSection
    );

router.route('/event-section')
    .patch(
        landingPageValidation.validateUpdateEventSection,
        landingPageController.updateEventSection
    );

router.route('/carousel')
    .patch(
        landingPageValidation.validateUpdateCarousel,
        landingPageController.updateCarousel
    );

module.exports = { landingPageRoutes: router };
