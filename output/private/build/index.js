"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const block_basekit_server_api_1 = require("@lark-opdev/block-basekit-server-api");
const const_1 = require("./const");
const exchange_api_1 = require("./exchange-api");
const { t } = block_basekit_server_api_1.field;
// 辅助函数，用于创建统一的响应对象
const createResponse = (status, exchangeRate, amount, convertDate) => ({
    code: block_basekit_server_api_1.FieldCode.Success,
    data: {
        status,
        exchange_rate: exchangeRate,
        amount,
        convert_date: convertDate,
    },
});
// 通过addDomainList添加请求接口的域名
block_basekit_server_api_1.basekit.addDomainList(["v6.exchangerate-api.com"]);
block_basekit_server_api_1.basekit.addField({
    // 可选的授权。声明捷径需要 HeaderBearerToken APIKey 授权
    // authorizations: [
    //   {
    //     id: 'Outlook',
    //     platform: 'Outlook',
    //     label: 'Outlook',
    //     required:false,
    //     type: AuthorizationType.HeaderBearerToken,
    //     // 通过 instructionsUrl 向用户显示获取 APIKey 的地址
    //     instructionsUrl: 'https://www.feishu.cn/',
    //   }
    // ],
    // 定义捷径的i18n语言资源
    i18n: {
        messages: {
            "zh-CN": {
                currency_label: "原始金额",
                currency_type: "币种兑换方式(例如：CNY:USD)",
                text_format: "文本格式",
                API_Key_placeholder: '请输入APIKey(若选择免费版请留空)',
                exchange_rate: "汇率",
                //转换状态
                status: '转换状态',
                //帮助文档
                help: "帮助文档",
                // 格式不对
                amount: "转换金额",
                convert_date: "转换日期",
            },
            "en-US": {
                currency_label: "Original amount",
                currency_type: "Currency Type(eg：CNY:USD)",
                text_format: "Text Format",
                exchange_rate: "Exchange Rate",
                help: "Help Document",
                status: 'Transition state',
                API_Key_placeholder: 'Please enter the APIKey (if you choose the free version, please leave it blank)',
                amount: "Conversion amount",
                convert_date: "Convert Date",
            },
            "ja-JP": {
                currency_label: "元の金額",
                currency_type: "通貨タイプ(eg：CNY:USD)",
                text_format: "テキスト形式",
                status: 'コンバージョンステータス',
                API_Key_placeholder: 'APIKeyを入力してください（無償版を選択するには空欄にしてください）',
                help: "ヘルプドキュメント",
                exchange_rate: "レート",
                amount: "換算金額",
                convert_date: "変換日",
            },
        },
    },
    // 定义捷径的入参
    formItems: [
        {
            key: "currency_label",
            label: t("currency_label"),
            component: block_basekit_server_api_1.FieldComponent.FieldSelect,
            props: {
                supportType: [block_basekit_server_api_1.FieldType.Number],
            },
            validator: {
                required: true,
            },
        },
        {
            key: "currency_type",
            label: t("currency_type"),
            component: block_basekit_server_api_1.FieldComponent.FieldSelect,
            props: {
                supportType: [block_basekit_server_api_1.FieldType.SingleSelect],
            },
            tooltips: [
                {
                    type: "link",
                    text: t("help"),
                    link: "https://p6bgwki4n6.feishu.cn/wiki/EvFhw1oybi06mikLqFBcbKINnGe",
                },
            ],
            validator: {
                required: true,
            },
        },
        {
            key: "api_key",
            label: "API_Key",
            component: block_basekit_server_api_1.FieldComponent.Input,
            tooltips: [
                {
                    type: "link",
                    text: t("help"),
                    link: "https://p6bgwki4n6.feishu.cn/wiki/EvFhw1oybi06mikLqFBcbKINnGe#share-UwOhdGGvvoSQ4Mx0UFscbEnOnre",
                },
            ],
            props: {
                placeholder: t('API_Key_placeholder'),
            },
        },
    ],
    // 定义捷径的返回结果类型
    resultType: {
        type: block_basekit_server_api_1.FieldType.Object,
        extra: {
            icon: {
                light: "https://lf3-static.bytednsdoc.com/obj/eden-cn/abjayvoz/ljhwZthlaukjlkulzlp/2024H2/huobi.png?x-resource-account=public",
            },
            properties: [
                {
                    key: "status",
                    isGroupByKey: true,
                    type: block_basekit_server_api_1.FieldType.Text,
                    primary: true,
                    title: t('status'),
                    // hidden: true,
                },
                {
                    key: "exchange_rate",
                    type: block_basekit_server_api_1.FieldType.Number,
                    title: t("exchange_rate"),
                    extra: {
                        formatter: block_basekit_server_api_1.NumberFormatter.DIGITAL_ROUNDED_2,
                    },
                },
                {
                    key: "amount",
                    type: block_basekit_server_api_1.FieldType.Number,
                    extra: {
                        formatter: block_basekit_server_api_1.NumberFormatter.DIGITAL_ROUNDED_2,
                    },
                    title: t("amount"),
                },
                {
                    key: "convert_date",
                    type: block_basekit_server_api_1.FieldType.DateTime,
                    title: t("convert_date"),
                },
            ],
        },
    },
    // formItemParams 为运行时传入的字段参数，对应字段配置里的 formItems （如引用的依赖字段）
    execute: async (formItemParams, context) => {
        const { currency_label, currency_type, api_key } = formItemParams;
        const convertDate = new Date().getTime();
        const { valid, list: [baseCurrency, targetCurrency] } = (0, const_1.isValidCurrencyPair)(currency_type);
        if (!valid) {
            return createResponse(`error:${currency_type} Invalid Format`, 0, 0, convertDate);
        }
        const { result: transformRate, code } = await (0, exchange_api_1.getExchangeRate)(context, baseCurrency, targetCurrency, api_key);
        if (code !== "SUCCESS") {
            return createResponse(`error:${code}`, 0, 0, convertDate);
        }
        return createResponse('success', transformRate, currency_label * transformRate, convertDate);
    },
});
exports.default = block_basekit_server_api_1.basekit;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQSxtRkFPOEM7QUFFOUMsbUNBQThDO0FBQzlDLGlEQUFpRDtBQUVqRCxNQUFNLEVBQUUsQ0FBQyxFQUFFLEdBQUcsZ0NBQUssQ0FBQztBQUVwQixtQkFBbUI7QUFDbkIsTUFBTSxjQUFjLEdBQUcsQ0FBQyxNQUFNLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDckUsSUFBSSxFQUFFLG9DQUFTLENBQUMsT0FBTztJQUN2QixJQUFJLEVBQUU7UUFDSixNQUFNO1FBQ04sYUFBYSxFQUFFLFlBQVk7UUFDM0IsTUFBTTtRQUNOLFlBQVksRUFBRSxXQUFXO0tBQzFCO0NBQ0YsQ0FBQyxDQUFDO0FBRUgsMkJBQTJCO0FBQzNCLGtDQUFPLENBQUMsYUFBYSxDQUFDLENBQUMseUJBQXlCLENBQUMsQ0FBQyxDQUFDO0FBRW5ELGtDQUFPLENBQUMsUUFBUSxDQUFDO0lBQ2YsMkNBQTJDO0lBQzNDLG9CQUFvQjtJQUNwQixNQUFNO0lBQ04scUJBQXFCO0lBQ3JCLDJCQUEyQjtJQUMzQix3QkFBd0I7SUFDeEIsc0JBQXNCO0lBQ3RCLGlEQUFpRDtJQUNqRCwrQ0FBK0M7SUFDL0MsaURBQWlEO0lBQ2pELE1BQU07SUFDTixLQUFLO0lBQ0wsZ0JBQWdCO0lBQ2hCLElBQUksRUFBRTtRQUNKLFFBQVEsRUFBRTtZQUNSLE9BQU8sRUFBRTtnQkFDUCxjQUFjLEVBQUUsTUFBTTtnQkFDdEIsYUFBYSxFQUFFLG9CQUFvQjtnQkFDbkMsV0FBVyxFQUFFLE1BQU07Z0JBQ25CLG1CQUFtQixFQUFDLHNCQUFzQjtnQkFDMUMsYUFBYSxFQUFFLElBQUk7Z0JBQ25CLE1BQU07Z0JBQ04sTUFBTSxFQUFDLE1BQU07Z0JBQ2IsTUFBTTtnQkFDTixJQUFJLEVBQUUsTUFBTTtnQkFDWixPQUFP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