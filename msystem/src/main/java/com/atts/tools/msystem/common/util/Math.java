package com.atts.tools.msystem.common.util;

public class Math {

    private Math() {
    }

    public static Double keep2Digits(Double value) {
        return java.lang.Math.floor(value * 100) / 100;
    }
}
