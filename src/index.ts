import {
  basekit,
  FieldType,
  field,
  FieldComponent,
  FieldCode,
  NumberFormatter,
} from "@lark-opdev/block-basekit-server-api";

import { isValidCurrencyPair } from "./const";
import { getExchangeRate } from "./exchange-api";

const { t } = field;

// 辅助函数，用于创建统一的响应对象
const createResponse = (status, exchangeRate, amount, convertDate) => ({
  code: FieldCode.Success,
  data: {
    status,
    exchange_rate: exchangeRate,
    amount,
    convert_date: convertDate,
  },
});

// 通过addDomainList添加请求接口的域名
basekit.addDomainList(["v6.exchangerate-api.com"]);

basekit.addField({
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
        API_Key_placeholder:'请输入APIKey(若选择免费版请留空)',
        exchange_rate: "汇率",
        //转换状态
        status:'转换状态',
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
        status:'Transition state',
        API_Key_placeholder:'Please enter the APIKey (if you choose the free version, please leave it blank)',
        amount: "Conversion amount",
        convert_date: "Convert Date",
      },
      "ja-JP": {
        currency_label: "元の金額",
        currency_type: "通貨タイプ(eg：CNY:USD)",
        text_format: "テキスト形式",
        status:'コンバージョンステータス',
        API_Key_placeholder:'APIKeyを入力してください（無償版を選択するには空欄にしてください）',
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
      component: FieldComponent.FieldSelect,
      props: {
        supportType: [FieldType.Number],
      },
      validator: {
        required: true,
      },
    },
    {
      key: "currency_type",
      label: t("currency_type"),
      component: FieldComponent.FieldSelect,
      props: {
        supportType: [FieldType.SingleSelect],
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
      component: FieldComponent.Input,
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
    type: FieldType.Object,
    extra: {
      icon: {
        light: "https://lf3-static.bytednsdoc.com/obj/eden-cn/abjayvoz/ljhwZthlaukjlkulzlp/2024H2/huobi.png?x-resource-account=public",
      },
      properties: [
        {
          key: "status",
          isGroupByKey: true,
          type: FieldType.Text,
          primary: true,
          title: t('status'),
          // hidden: true,
        },

        {
          key: "exchange_rate",
          type: FieldType.Number,
          title: t("exchange_rate"),

          extra: {
            formatter: NumberFormatter.DIGITAL_ROUNDED_2,
          },
        },

        {
          key: "amount",
          type: FieldType.Number,
          extra: {
            formatter: NumberFormatter.DIGITAL_ROUNDED_2,
          },

          title: t("amount"),
        },
        {
          key: "convert_date",
          type: FieldType.DateTime,
          title: t("convert_date"),
        },
      ],
    },
  },
  // formItemParams 为运行时传入的字段参数，对应字段配置里的 formItems （如引用的依赖字段）
  execute: async (formItemParams, context) => {

    const { currency_label, currency_type, api_key } = formItemParams;

    const convertDate = new Date().getTime()
    const { valid, list: [baseCurrency, targetCurrency] } = isValidCurrencyPair(currency_type);
  
    if (!valid) {
      return createResponse(`error:${currency_type} Invalid Format`, 0, 0, convertDate)
    }
    const { result: transformRate, code } = await getExchangeRate(
      context,
      baseCurrency,
      targetCurrency,
      api_key
    );
    if (code !== "SUCCESS") {
      return createResponse(`error:${code}`, 0, 0, convertDate)
    }
    return createResponse('success', transformRate, currency_label * transformRate, convertDate)

  },
});
export default basekit;
