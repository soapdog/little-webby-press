# WebMonetization Section

WebMonetization is a exciting new Web Technology that has the potential to revolutionise how content creators make their income.


> ### Motivation
>
> The ability to transfer money has been a long-standing omission from the web platform. As a result, the web suffers from a flood of advertising and corrupt business models. Web Monetization provides an open, native, efficient, and automatic way to compensate creators, pay for API calls, and support crucial web infrastructure.
>
> &mdash; _Source: [Web Monetization Website](https://webmonetization.org/)_

The development of Little Webby Press has been originally funded by [Grant For The Web](https://www.grantfortheweb.org/), and WebMonetization has always been a core feature of our little tool.

You can create a `[webmonetization]` section and add your [_WebMonetization Payment Pointer_](https://paymentpointers.org/) to enable WebMonetization for the Website. If you do that, then readers who are using WebMonetization-enabled browsers to read your book on the Web will be able to automatically send you some microtransactions.


## Default values

```toml
[webmonetization]
endpoint = false
```

WebMonetization is disabled by default. To activate it, fill in your _payment pointer_.

## Endpoint

This field points to your payment pointer.

```toml
[webmonetization]
endpoint = "$ilp.uphold.com/doesntexist"
```


