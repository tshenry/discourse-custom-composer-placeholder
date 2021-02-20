import { apiInitializer } from "discourse/lib/api";
import discourseComputed from "discourse-common/utils/decorators";

export default apiInitializer("0.8", (api) => {
  const rawSplitSettings = settings.custom_placeholder.split("|");

  api.modifyClass("component:composer-editor", {
    @discourseComputed("composer.requiredCategoryMissing")
    replyPlaceholder(requiredCategoryMissing) {
      let textKey;
      if (this.composer.action === "createTopic") {
        rawSplitSettings.forEach((rawSetting) => {
          const settingParts = rawSetting.split("~");
          const placeholderText = settingParts[0];
          const categoryIds = settingParts[1] ? settingParts[1].split(",") : [];
          const trustLevels = settingParts[2] ? settingParts[2].split(",") : [];

          const showForCategory = categoryIds.some(
            (c) => parseInt(c) === this.composer._categoryId || c === "all"
          );
          const showForTrustLevel = trustLevels.some(
            (t) => parseInt(t) === this.currentUser.trust_level || t === "all"
          );

          if (showForCategory && showForTrustLevel) {
            textKey = themePrefix(
              `custom_composer_placeholder.text_${placeholderText}`
            );
          }
        });
      }
      return textKey ? textKey : this._super(requiredCategoryMissing);
    },
  });
});
