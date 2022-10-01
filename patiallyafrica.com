[33mcommit b46099df29d107c95c30a05680dcdd708fb9080e[m[33m ([m[1;36mHEAD -> [m[1;32mdevelopment[m[33m)[m
Author: linibensonjr <linibensonjr@gmail.com>
Date:   Sat Oct 1 17:40:04 2022 +0100

    chore: Revert url format  to fix server error

[33mcommit 9c019fe455226255ea2821c7c57a4bc71b5f4264[m
Author: linibensonjr <linibensonjr@gmail.com>
Date:   Sat Oct 1 14:02:48 2022 +0100

    chore: Update links and images to fix https error

[33mcommit 5b6e7369759f4cc39d9f7db64ce02efe1b3f5f5f[m
Author: linibensonjr <linibensonjr@gmail.com>
Date:   Sat Oct 1 13:49:41 2022 +0100

    chore: Update link to fix https error

[33mcommit 8f818acb5ed6dd35d52cf5869ad6098aeb66acef[m
Author: linibensonjr <linibensonjr@gmail.com>
Date:   Fri Sep 30 15:11:55 2022 +0100

    chore: Change the default podcast image on staticfiles folder

[33mcommit 882bf3ad2fe216a84298b3097091e33f93d19257[m
Author: linibensonjr <linibensonjr@gmail.com>
Date:   Fri Sep 30 13:13:49 2022 +0100

    chore: Change the default podcast image

[33mcommit af8156c7e330f8745d8a8d44f6848ed353bed17c[m
Author: linibensonjr <linibensonjr@gmail.com>
Date:   Wed Sep 28 23:01:40 2022 +0100

    chore: Refactor code. Limit number of other episode to 6 on episode details page

[33mcommit 3efaef7a2f7aa0e4c1d86b96048e75f9f564bf53[m
Author: linibensonjr <linibensonjr@gmail.com>
Date:   Tue Sep 27 13:08:40 2022 +0100

    Add static files

[33mcommit 32198b28c2cf24323f842aba88667d4d219baf5a[m
Author: linibensonjr <linibensonjr@gmail.com>
Date:   Sun Sep 25 22:25:57 2022 +0100

    feat: Add support for filter by tag

[33mcommit f72d5a038992abbcd03888cabe9e5be15443a798[m
Author: linibensonjr <linibensonjr@gmail.com>
Date:   Sun Sep 25 09:33:07 2022 +0100

    chore: Remove publish button once episode has been published

[33mcommit 49d151e27fa8acc4c14df329822d7bd5ea67ada5[m
Author: linibensonjr <linibensonjr@gmail.com>
Date:   Fri Sep 23 21:37:12 2022 +0100

    chore: Update about us and support us information

[33mcommit a60ef2cad787ff945ae42e8e9c1144e505aaa462[m
Author: linibensonjr <linibensonjr@gmail.com>
Date:   Thu Sep 22 07:24:51 2022 +0100

    chore: Fix social links on navbar and footer

[33mcommit 013b788024f4f88513e771a74552ea352c384d32[m
Author: linibensonjr <linibensonjr@gmail.com>
Date:   Thu Sep 22 06:50:50 2022 +0100

    feat: Add search text to search results

[33mcommit 84ee9bd93c7240a29a0bb81de3416bfc3ce78399[m
Merge: d9e5825 6d3a77c
Author: linibensonjr <linibensonjr@gmail.com>
Date:   Mon Sep 12 11:21:22 2022 +0100

    Merge branch 'development' of https://github.com/linibensonjr/geospatially-africa into development

[33mcommit d9e5825ae15c9424a6b9618b2d2342dc7f53ab82[m
Author: linibensonjr <linibensonjr@gmail.com>
Date:   Mon Sep 12 11:20:40 2022 +0100

    feat: Add statistics and map to About Us page

[33mcommit 6d3a77cdd54cd7df54996e3fe7a1f7d53e2ebe90[m
Merge: b720358 8330d97
Author: Iniobong Benson <31708129+linibensonjr@users.noreply.github.com>
Date:   Sat Sep 10 23:33:22 2022 +0100

    Merge pull request #20 from linibensonjr/main
    
    Update from main branch

[33mcommit 8330d973bd7489a5472ae329b643a08c07721be2[m
Merge: b1663ee b720358
Author: Iniobong Benson <31708129+linibensonjr@users.noreply.github.com>
Date:   Sat Sep 10 23:32:24 2022 +0100

    Merge pull request #21 from linibensonjr/development
    
    feat: Add count of episode to about page template

[33mcommit b72035877f1e686b7c9d69732c852bb1b05add06[m
Author: linibensonjr <linibensonjr@gmail.com>
Date:   Sat Sep 10 20:45:43 2022 +0100

    feat: Add count of episode to about page template

[33mcommit b1663ee9448f85f8d805b0743cbeb6e35acf8804[m
Merge: 601362c aca7e0d
Author: Iniobong Benson <31708129+linibensonjr@users.noreply.github.com>
Date:   Mon Sep 5 20:26:12 2022 +0100

    Merge pull request #19 from linibensonjr/development
    
    chore: Remove Buy me a coffe widget

[33mcommit aca7e0d30b66f63f55085318fbee51a3d027a35a[m
Author: linibensonjr <linibensonjr@gmail.com>
Date:   Sun Sep 4 19:52:47 2022 +0100

    chore: Remove Buy me a coffe widget

[33mcommit 601362ce727dc50fc3de98c6f41bba446e58f678[m
Merge: e4602ac 4cf56a2
Author: Iniobong Benson <31708129+linibensonjr@users.noreply.github.com>
Date:   Thu Sep 1 18:53:54 2022 +0100

    Merge pull request #18 from linibensonjr/development
    
    chore: Apply  podcast color scheme across pagess

[33mcommit 4cf56a2839d5e9a756e9cb528918efa21eb4f3f5[m
Author: linibensonjr <linibensonjr@gmail.com>
Date:   Thu Sep 1 18:53:19 2022 +0100

    chore: Apply  podcast color scheme across pagess

[33mcommit e4602ac6628a5ea0924488e4af87870bab742453[m
Merge: 9aac0fb ab2db88
Author: Iniobong Benson <31708129+linibensonjr@users.noreply.github.com>
Date:   Thu Sep 1 18:27:21 2022 +0100

    Merge pull request #17 from linibensonjr/development
    
    Merge pull request #16 from linibensonjr/main

[33mcommit ab2db88df3d20dca5b86e2268fa0b13cd0ddd668[m
Merge: 053830a 9aac0fb
Author: Iniobong Benson <31708129+linibensonjr@users.noreply.github.com>
Date:   Thu Sep 1 18:26:53 2022 +0100

    Merge pull request #16 from linibensonjr/main
    
    Merge pull request #15 from linibensonjr/development

[33mcommit 9aac0fbdea6e7f560fc4df8040c385f182145f4e[m
Merge: f3f917d 053830a
Author: Iniobong Benson <31708129+linibensonjr@users.noreply.github.com>
Date:   Thu Sep 1 08:50:32 2022 +0100

    Merge pull request #15 from linibensonjr/development
    
    PR: Update main branch with changes on development branch

[33mcommit 053830af86d429547c79d37eceb5b7f6fe08f322[m
Author: linibensonjr <linibensonjr@gmail.com>
Date:   Wed Aug 31 23:43:42 2022 +0100

    chore: Folder structure - Add error folder and move error pages into
    error folder"

[33mcommit 74ee2068c080b308db4a491c7e9a4fb52c19e9d5[m
Author: linibensonjr <linibensonjr@gmail.com>
Date:   Wed Aug 31 23:38:42 2022 +0100

    chore: Remove unused static image files

[33mcommit 971d8656194e06a41399a055029d0fda49b4fed2[m
Author: linibensonjr <linibensonjr@gmail.com>
Date:   Wed Aug 31 23:37:50 2022 +0100

    chore: Add Iniobong's image

[33mcommit dc0620cf96fd9cb47faaf146235c6636120a7d0d[m
Author: linibensonjr <linibensonjr@gmail.com>
Date:   Wed Aug 31 23:36:45 2022 +0100

    feature: Dynamically change host picture based on host name

[33mcommit f3f917d3c832ec098f6947722b7abf73a7567ba7[m[33m ([m[1;32mmain[m[33m)[m
Merge: 8646241 d00a814
Author: Iniobong Benson <31708129+linibensonjr@users.noreply.github.com>
Date:   Wed Aug 31 16:24:45 2022 +0100

    Merge pull request #14 from linibensonjr/development
    
    Merge pull request #13 from linibensonjr/main

[33mcommit d00a814b29b7704698c9a20c8fd044c4d70512aa[m
Merge: 8c4cc39 8646241
Author: Iniobong Benson <31708129+linibensonjr@users.noreply.github.com>
Date:   Wed Aug 31 16:23:54 2022 +0100

    Merge pull request #13 from linibensonjr/main
    
    Merge pull request #12 from linibensonjr/development

[33mcommit 864624105d69c91b69d9f68e2a39781dc0d57461[m
Merge: ad1c10c 8c4cc39
Author: Iniobong Benson <31708129+linibensonjr@users.noreply.github.com>
Date:   Tue Aug 30 20:04:18 2022 +0100

    Merge pull request #12 from linibensonjr/development
    
    style: Remove auto counter from about us page

[33mcommit 8c4cc391cd5d2f033c4ae983c4b5b8433604cda2[m
Author: linibensonjr <linibensonjr@gmail.com>
Date:   Tue Aug 30 20:03:27 2022 +0100

    style: Remove auto counter from about us page

[33mcommit 9b907c85044b059c9cd397069d1523095bfc3cae[m
Author: linibensonjr <linibensonjr@gmail.com>
Date:   Tue Aug 30 20:00:26 2022 +0100

    style: Add class style to div on support page

[33mcommit 8223ddfa2f56ed370b7ecc7b8007eb395664a496[m
Merge: 8a08d5a ad1c10c
Author: linibensonjr <linibensonjr@gmail.com>
Date:   Tue Aug 30 06:43:09 2022 +0100

    Merge branch 'main' of https://github.com/linibensonjr/geospatially-africa into development

[33mcommit ad1c10cf35eee051373d05356934148523997537[m
Author: Iniobong Benson <31708129+linibensonjr@users.noreply.github.com>
Date:   Tue Aug 30 06:42:16 2022 +0100

    chore: Fix typo on support page

[33mcommit 8a08d5a50f6e613d5e1fbbff57a7d2594a30398d[m
