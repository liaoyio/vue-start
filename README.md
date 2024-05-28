# Vue Start



###  [`renovate` 自动更新依赖](https://github.com/renovatebot/renovate)

`github` 的 [renovate](https://github.com/marketplace/renovate) 机器人会定期对
`github` 检查依赖，并向仓库提起 `pr`，更新策略 👉
[unjs/renovate-config](https://github.com/unjs/renovate-config)

当然你也可以执行，来手动更新 👇

```shell
pnpm deps:fresh
```

具体可见 👉 [renovate](https://github.com/renovatebot/renovate)

<br />
<br />

### [自动版本更新并生成 `CHANGELOG`](https://github.com/unjs/changelogen)

当我们执行 `pnpm run release` 时，会自动进行版本更新，并更新
[CHANGELOG.md](./CHANGELOG.md)。

具体可见 👉 [unjs/changelogen](https://github.com/unjs/changelogen)

<br />
<br />
