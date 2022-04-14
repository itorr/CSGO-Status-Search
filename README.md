# CSGO 对局信息速览

在玩 CSGO 头号特训模式中、经常会遇到眼熟的外挂用户

CurseRed 建议做一个 status 用户信息速查工具、方便我们快速确认当局敏感用户，于是就有了这个工具

## 地址
[https://lab.magiconch.com/csgo-hacker-log/](https://lab.magiconch.com/csgo-hacker-log/?from=github)


## 使用

 - 游戏中 ~ 调出控制台
 - 输入 status 回车
 - 复制控制台中输出的内容到输入框
 - 即可对当前对局用户信息进行快速确认

## 功能
目前支持展示的信息
 - 唯一 ID
 - 游戏昵称
 - 社区昵称
 - 头像
 - 资料未公开
 - Steam 注册时间
 - Steam 等级
 - CSGO 游戏时长
 - VAC封禁
 - 社区封禁
 - 交易封禁
 - 游戏封禁
 - 延迟
 - 发包数

敏感信息会 标红 提醒

游戏中昵称和社区中不一致的情况会在界面上 红名 标出社区昵称，可能是外挂功能一部分

表格标题单击可排序

点击玩家对应 userId 可复制投票踢指定玩家的控制台命令

### 标记

标记功能可对当前对局玩家进行快速标记，目前共有三种颜色 红、 黄、 绿 方便用户使用，具体作用可自行分配

每次标记会记录操作时间，下回在对局中遇到已标记玩家可以看到最后一次标记时间

高级选项中可自行输入名称来 建立 或 加入 标记库，分享标记库名称可以多人公用标记信息

### say
当前对局有标红玩家时，可快速复制 say 命令，在控制台迅速发言

竞技、休闲模式可勾选 尝试投票踢出 在发言同时尝试发起投票踢出对应玩家

### 辅助
参考信息不足时可点击用户右侧的链接们、跳转到第三方网站确认更多信息

csgostats.gg 可查看玩家对局情况 https://csgostats.gg

SteamAnalyst 可预估玩家饰品价格 https://csgo.steamanalyst.com

头号特训模式玩家也可以尝试在 CSGO作弊狗 http://csgozbg.cn 数据库中查询是否有已登记的作弊玩家

### 参考

Steam Web API Documentation https://steamapi.xpaw.me with ♥ by xPaw

Steam Web API https://developer.valvesoftware.com/wiki/Steam_Web_API

Ban Checker for Steam https://chrome.google.com/webstore/detail/ban-checker-for-steam/canbadmphamemnmdfngmcabnjmjgaiki

Steam Inventory Helper https://chrome.google.com/webstore/detail/steam-inventory-helper/cmeakgjggjdlcpncigglobpjbkabhmjl




## GitHub
[https://github.com/itorr/CSGO-Status-Search](https://github.com/itorr/CSGO-Status-Search)

